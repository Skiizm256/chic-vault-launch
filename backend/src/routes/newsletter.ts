import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

// ─── Subscribe ────────────────────────────────────────────────────────────────
router.post(
  '/subscribe',
  [body('email').isEmail().normalizeEmail()],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Please provide a valid email address' });
      return;
    }

    const db = getDb();
    const { email } = req.body;

    const existing = db.prepare('SELECT id, is_active FROM newsletter WHERE email = ?').get(email) as any;

    if (existing) {
      if (existing.is_active) {
        res.json({ message: 'You are already subscribed!' });
        return;
      }
      // Re-subscribe
      db.prepare('UPDATE newsletter SET is_active = 1 WHERE email = ?').run(email);
      res.json({ message: 'Welcome back! You have been re-subscribed.' });
      return;
    }

    db.prepare('INSERT INTO newsletter (id, email) VALUES (?, ?)').run(uuidv4(), email);
    res.status(201).json({ message: 'Thank you for subscribing!' });
  }
);

// ─── Unsubscribe ──────────────────────────────────────────────────────────────
router.post(
  '/unsubscribe',
  [body('email').isEmail().normalizeEmail()],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ error: 'Please provide a valid email address' });
      return;
    }

    const db = getDb();
    db.prepare('UPDATE newsletter SET is_active = 0 WHERE email = ?').run(req.body.email);
    res.json({ message: 'You have been unsubscribed.' });
  }
);

// ─── Admin: list subscribers ──────────────────────────────────────────────────
router.get('/', authenticate, requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const { active, page = '1', limit = '50' } = req.query as Record<string, string>;

  const conditions: string[] = [];
  const params: any[] = [];

  if (active !== undefined) {
    conditions.push('is_active = ?');
    params.push(active === 'true' ? 1 : 0);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const total = (db.prepare(`SELECT COUNT(*) as count FROM newsletter ${where}`).get(...params) as any).count;
  const subscribers = db.prepare(`SELECT * FROM newsletter ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limitNum, offset);

  res.json({ subscribers, pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) } });
});

export default router;
