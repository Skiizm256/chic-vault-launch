import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// ─── Register ────────────────────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password, firstName, lastName } = req.body;
    const db = getDb();

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const id = uuidv4();

    db.prepare(`
      INSERT INTO users (id, email, password, first_name, last_name)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, email, hashedPassword, firstName, lastName);

    const token = jwt.sign(
      { userId: id, email, role: 'customer' },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id, email, firstName, lastName, role: 'customer' },
    });
  }
);

// ─── Login ───────────────────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;
    const db = getDb();

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });
  }
);

// ─── Get current user ────────────────────────────────────────────────────────
router.get('/me', authenticate, (req: Request, res: Response) => {
  const db = getDb();
  const user = db.prepare(
    'SELECT id, email, first_name, last_name, role, created_at FROM users WHERE id = ?'
  ).get(req.user!.userId) as any;

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    role: user.role,
    createdAt: user.created_at,
  });
});

// ─── Update profile ──────────────────────────────────────────────────────────
router.put(
  '/me',
  authenticate,
  [
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('currentPassword').optional(),
    body('newPassword').optional().isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user!.userId) as any;

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { firstName, lastName, currentPassword, newPassword } = req.body;

    // If they want to change password
    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ error: 'Current password is required to set a new one' });
        return;
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        res.status(401).json({ error: 'Current password is incorrect' });
        return;
      }
      const newHash = await bcrypt.hash(newPassword, 12);
      db.prepare('UPDATE users SET password = ?, updated_at = datetime(\'now\') WHERE id = ?')
        .run(newHash, user.id);
    }

    if (firstName || lastName) {
      db.prepare(`
        UPDATE users SET
          first_name = COALESCE(?, first_name),
          last_name  = COALESCE(?, last_name),
          updated_at = datetime('now')
        WHERE id = ?
      `).run(firstName ?? null, lastName ?? null, user.id);
    }

    const updated = db.prepare(
      'SELECT id, email, first_name, last_name, role FROM users WHERE id = ?'
    ).get(user.id) as any;

    res.json({
      id: updated.id,
      email: updated.email,
      firstName: updated.first_name,
      lastName: updated.last_name,
      role: updated.role,
    });
  }
);

// ─── User addresses ──────────────────────────────────────────────────────────
router.get('/me/addresses', authenticate, (req: Request, res: Response) => {
  const db = getDb();
  const addresses = db.prepare(
    'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC'
  ).all(req.user!.userId);
  res.json(addresses);
});

router.post(
  '/me/addresses',
  authenticate,
  [
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('address').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('postalCode').trim().notEmpty(),
    body('country').trim().notEmpty(),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const db = getDb();
    const { firstName, lastName, address, city, postalCode, country, phone, label, isDefault } = req.body;
    const id = uuidv4();

    if (isDefault) {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(req.user!.userId);
    }

    db.prepare(`
      INSERT INTO addresses (id, user_id, label, first_name, last_name, address, city, postal_code, country, phone, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.user!.userId, label ?? 'Home', firstName, lastName, address, city, postalCode, country, phone ?? null, isDefault ? 1 : 0);

    const created = db.prepare('SELECT * FROM addresses WHERE id = ?').get(id);
    res.status(201).json(created);
  }
);

export default router;
