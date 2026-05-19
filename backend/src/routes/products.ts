import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();

function parseProduct(row: any) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    category: row.category,
    subcategory: row.subcategory,
    colors: JSON.parse(row.colors),
    sizes: JSON.parse(row.sizes),
    images: JSON.parse(row.images),
    description: row.description,
    details: JSON.parse(row.details),
    isNew: Boolean(row.is_new),
    isSale: Boolean(row.is_sale),
    rating: row.rating,
    reviews: row.reviews,
    stock: row.stock,
    createdAt: row.created_at,
  };
}

// ─── List / search products ──────────────────────────────────────────────────
router.get(
  '/',
  [
    query('category').optional().isIn(['women', 'men', 'accessories', 'new']),
    query('sale').optional().isBoolean(),
    query('minPrice').optional().isFloat({ min: 0 }),
    query('maxPrice').optional().isFloat({ min: 0 }),
    query('q').optional().isString(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('sort').optional().isIn(['price_asc', 'price_desc', 'newest', 'rating']),
  ],
  (req: Request, res: Response) => {
    const db = getDb();
    const {
      category,
      sale,
      minPrice,
      maxPrice,
      q,
      page = '1',
      limit = '20',
      sort = 'newest',
    } = req.query as Record<string, string>;

    const conditions: string[] = ['is_active = 1'];
    const params: (string | number)[] = [];

    if (category === 'new') {
      conditions.push('is_new = 1');
    } else if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    if (sale === 'true') {
      conditions.push('is_sale = 1');
    }

    if (minPrice) {
      conditions.push('price >= ?');
      params.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      conditions.push('price <= ?');
      params.push(parseFloat(maxPrice));
    }

    if (q) {
      conditions.push('(name LIKE ? OR description LIKE ? OR subcategory LIKE ?)');
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const orderMap: Record<string, string> = {
      price_asc: 'price ASC',
      price_desc: 'price DESC',
      newest: 'created_at DESC',
      rating: 'rating DESC',
    };
    const orderBy = orderMap[sort] ?? 'created_at DESC';

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const total = (db.prepare(`SELECT COUNT(*) as count FROM products ${where}`).get(...params) as any).count;
    const rows = db.prepare(`SELECT * FROM products ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`).all(...params, limitNum, offset);

    res.json({
      products: rows.map(parseProduct),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  }
);

// ─── Get single product ──────────────────────────────────────────────────────
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1').get(req.params.id) as any;

  if (!row) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  // Include reviews
  const reviews = db.prepare(`
    SELECT r.*, u.first_name, u.last_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
    LIMIT 20
  `).all(req.params.id) as any[];

  res.json({
    ...parseProduct(row),
    reviewsList: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      body: r.body,
      isVerified: Boolean(r.is_verified),
      createdAt: r.created_at,
      author: `${r.first_name} ${r.last_name[0]}.`,
    })),
  });
});

// ─── Create product (admin) ───────────────────────────────────────────────────
router.post(
  '/',
  authenticate,
  requireAdmin,
  [
    body('name').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('category').isIn(['women', 'men', 'accessories', 'new']),
    body('subcategory').trim().notEmpty(),
    body('description').trim().notEmpty(),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const db = getDb();
    const {
      name, price, originalPrice, category, subcategory,
      colors, sizes, images, description, details,
      isNew, isSale, stock,
    } = req.body;

    const id = uuidv4();
    db.prepare(`
      INSERT INTO products
        (id, name, price, original_price, category, subcategory, colors, sizes, images,
         description, details, is_new, is_sale, stock)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, name, price, originalPrice ?? null, category, subcategory,
      JSON.stringify(colors ?? []), JSON.stringify(sizes ?? []),
      JSON.stringify(images ?? []), description, JSON.stringify(details ?? []),
      isNew ? 1 : 0, isSale ? 1 : 0, stock ?? 100
    );

    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.status(201).json(parseProduct(row));
  }
);

// ─── Update product (admin) ───────────────────────────────────────────────────
router.put('/:id', authenticate, requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  const fields = req.body;
  const updates: string[] = [];
  const values: any[] = [];

  const fieldMap: Record<string, string> = {
    name: 'name',
    price: 'price',
    originalPrice: 'original_price',
    category: 'category',
    subcategory: 'subcategory',
    description: 'description',
    isNew: 'is_new',
    isSale: 'is_sale',
    stock: 'stock',
    isActive: 'is_active',
    rating: 'rating',
    reviews: 'reviews',
  };

  for (const [key, col] of Object.entries(fieldMap)) {
    if (key in fields) {
      updates.push(`${col} = ?`);
      let val = fields[key];
      if (typeof val === 'boolean') val = val ? 1 : 0;
      values.push(val);
    }
  }

  // JSON fields
  for (const key of ['colors', 'sizes', 'images', 'details']) {
    if (key in fields) {
      updates.push(`${key} = ?`);
      values.push(JSON.stringify(fields[key]));
    }
  }

  if (updates.length === 0) {
    res.status(400).json({ error: 'No valid fields to update' });
    return;
  }

  updates.push("updated_at = datetime('now')");
  values.push(req.params.id);

  db.prepare(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(parseProduct(row));
});

// ─── Delete product (admin) ───────────────────────────────────────────────────
router.delete('/:id', authenticate, requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const result = db.prepare('UPDATE products SET is_active = 0 WHERE id = ?').run(req.params.id);
  if (result.changes === 0) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ message: 'Product deactivated' });
});

// ─── Submit review ────────────────────────────────────────────────────────────
router.post(
  '/:id/reviews',
  authenticate,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('title').optional().trim().isLength({ max: 100 }),
    body('body').optional().trim().isLength({ max: 2000 }),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const db = getDb();
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const existing = db.prepare(
      'SELECT id FROM reviews WHERE product_id = ? AND user_id = ?'
    ).get(req.params.id, req.user!.userId);

    if (existing) {
      res.status(409).json({ error: 'You have already reviewed this product' });
      return;
    }

    // Check if user bought this product (verified purchase)
    const purchase = db.prepare(`
      SELECT oi.id FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = ? AND oi.product_id = ? AND o.status IN ('delivered','shipped')
    `).get(req.user!.userId, req.params.id);

    const id = uuidv4();
    const { rating, title, body: reviewBody } = req.body;

    db.prepare(`
      INSERT INTO reviews (id, product_id, user_id, rating, title, body, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, req.params.id, req.user!.userId, rating, title ?? null, reviewBody ?? null, purchase ? 1 : 0);

    // Update product rating average
    const stats = db.prepare(
      'SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ?'
    ).get(req.params.id) as any;

    db.prepare('UPDATE products SET rating = ?, reviews = ? WHERE id = ?')
      .run(Math.round(stats.avg * 10) / 10, stats.count, req.params.id);

    res.status(201).json({ id, message: 'Review submitted' });
  }
);

export default router;
