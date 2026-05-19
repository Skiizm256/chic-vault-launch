import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

// ─── Get wishlist ─────────────────────────────────────────────────────────────
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const items = db.prepare(`
    SELECT w.id as wishlist_id, w.created_at as wishlisted_at, p.*
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ? AND p.is_active = 1
    ORDER BY w.created_at DESC
  `).all(req.user!.userId) as any[];

  res.json(items.map((row) => ({
    wishlistId: row.wishlist_id,
    wishlistedAt: row.wishlisted_at,
    product: {
      id: row.id,
      name: row.name,
      price: row.price,
      originalPrice: row.original_price,
      category: row.category,
      subcategory: row.subcategory,
      colors: JSON.parse(row.colors),
      sizes: JSON.parse(row.sizes),
      images: JSON.parse(row.images),
      isNew: Boolean(row.is_new),
      isSale: Boolean(row.is_sale),
      rating: row.rating,
      reviews: row.reviews,
    },
  })));
});

// ─── Add to wishlist ──────────────────────────────────────────────────────────
router.post('/:productId', (req: Request, res: Response) => {
  const db = getDb();

  const product = db.prepare('SELECT id FROM products WHERE id = ? AND is_active = 1').get(req.params.productId);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const existing = db.prepare(
    'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?'
  ).get(req.user!.userId, req.params.productId);

  if (existing) {
    res.status(409).json({ error: 'Already in wishlist' });
    return;
  }

  const id = uuidv4();
  db.prepare('INSERT INTO wishlist (id, user_id, product_id) VALUES (?, ?, ?)').run(
    id, req.user!.userId, req.params.productId
  );

  res.status(201).json({ id, message: 'Added to wishlist' });
});

// ─── Remove from wishlist ─────────────────────────────────────────────────────
router.delete('/:productId', (req: Request, res: Response) => {
  const db = getDb();
  const result = db.prepare(
    'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?'
  ).run(req.user!.userId, req.params.productId);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Item not in wishlist' });
    return;
  }

  res.json({ message: 'Removed from wishlist' });
});

// ─── Toggle (add if not present, remove if present) ──────────────────────────
router.put('/:productId/toggle', (req: Request, res: Response) => {
  const db = getDb();

  const product = db.prepare('SELECT id FROM products WHERE id = ? AND is_active = 1').get(req.params.productId);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const existing = db.prepare(
    'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?'
  ).get(req.user!.userId, req.params.productId) as any;

  if (existing) {
    db.prepare('DELETE FROM wishlist WHERE id = ?').run(existing.id);
    res.json({ inWishlist: false, message: 'Removed from wishlist' });
  } else {
    const id = uuidv4();
    db.prepare('INSERT INTO wishlist (id, user_id, product_id) VALUES (?, ?, ?)').run(
      id, req.user!.userId, req.params.productId
    );
    res.json({ inWishlist: true, message: 'Added to wishlist' });
  }
});

export default router;
