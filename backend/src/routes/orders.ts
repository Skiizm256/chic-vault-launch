import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/database.js';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = Router();

function parseOrder(order: any, items: any[]) {
  return {
    id: order.id,
    userId: order.user_id,
    email: order.email,
    status: order.status,
    subtotal: order.subtotal,
    shippingCost: order.shipping_cost,
    total: order.total,
    shippingInfo: JSON.parse(order.shipping_info),
    paymentInfo: JSON.parse(order.payment_info),
    notes: order.notes,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: items.map((i) => ({
      id: i.id,
      productId: i.product_id,
      productName: i.product_name,
      productPrice: i.product_price,
      quantity: i.quantity,
      selectedSize: i.selected_size,
      selectedColor: i.selected_color,
      lineTotal: i.line_total,
    })),
  };
}

// ─── Place an order (guest or authenticated) ─────────────────────────────────
router.post(
  '/',
  optionalAuth,
  [
    body('email').isEmail().normalizeEmail(),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.productId').notEmpty(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('items.*.selectedSize').notEmpty(),
    body('items.*.selectedColor').notEmpty(),
    body('shippingInfo.firstName').notEmpty(),
    body('shippingInfo.lastName').notEmpty(),
    body('shippingInfo.address').notEmpty(),
    body('shippingInfo.city').notEmpty(),
    body('shippingInfo.postalCode').notEmpty(),
    body('shippingInfo.country').notEmpty(),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const db = getDb();
    const { email, items, shippingInfo, paymentInfo, notes } = req.body;

    // Validate products and build line items
    const lineItems: {
      id: string;
      orderId: string;
      productId: string;
      productName: string;
      productPrice: number;
      quantity: number;
      selectedSize: string;
      selectedColor: string;
      lineTotal: number;
    }[] = [];

    let subtotal = 0;

    for (const item of items) {
      const product = db.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1').get(item.productId) as any;
      if (!product) {
        res.status(400).json({ error: `Product not found: ${item.productId}` });
        return;
      }
      if (product.stock < item.quantity) {
        res.status(400).json({ error: `Insufficient stock for: ${product.name}` });
        return;
      }

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      lineItems.push({
        id: uuidv4(),
        orderId: '',           // filled after order insert
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        lineTotal,
      });
    }

    const shippingCost = subtotal >= 150 ? 0 : 15;
    const total = subtotal + shippingCost;
    const orderId = uuidv4();

    // Safe payment info — never store real card data
    const safePaymentInfo = {
      method: paymentInfo?.method ?? 'card',
      last4: paymentInfo?.last4 ?? '****',
      status: 'paid',
    };

    const insertOrder = db.transaction(() => {
      db.prepare(`
        INSERT INTO orders (id, user_id, email, subtotal, shipping_cost, total, shipping_info, payment_info, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        orderId,
        req.user?.userId ?? null,
        email,
        subtotal,
        shippingCost,
        total,
        JSON.stringify(shippingInfo),
        JSON.stringify(safePaymentInfo),
        notes ?? null
      );

      const insertItem = db.prepare(`
        INSERT INTO order_items (id, order_id, product_id, product_name, product_price, quantity, selected_size, selected_color, line_total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const item of lineItems) {
        insertItem.run(item.id, orderId, item.productId, item.productName, item.productPrice, item.quantity, item.selectedSize, item.selectedColor, item.lineTotal);

        // Decrement stock
        db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.productId);
      }

      // Update order status to confirmed (simulating payment success)
      db.prepare("UPDATE orders SET status = 'confirmed' WHERE id = ?").run(orderId);
    });

    insertOrder();

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId) as any[];

    res.status(201).json({
      message: 'Order placed successfully',
      order: parseOrder(order, orderItems),
    });
  }
);

// ─── Get user's orders ────────────────────────────────────────────────────────
router.get('/my', authenticate, (req: Request, res: Response) => {
  const db = getDb();
  const orders = db.prepare(
    "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC"
  ).all(req.user!.userId) as any[];

  const result = orders.map((order) => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id) as any[];
    return parseOrder(order, items);
  });

  res.json(result);
});

// ─── Get single order ─────────────────────────────────────────────────────────
router.get('/:id', authenticate, (req: Request, res: Response) => {
  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  // Allow user to access own order or admin to access any
  if (req.user!.role !== 'admin' && order.user_id !== req.user!.userId) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id) as any[];
  res.json(parseOrder(order, items));
});

// ─── Look up guest order by email + orderId ───────────────────────────────────
router.post('/lookup', (req: Request, res: Response) => {
  const { orderId, email } = req.body;
  if (!orderId || !email) {
    res.status(400).json({ error: 'orderId and email are required' });
    return;
  }

  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND email = ?').get(orderId, email.toLowerCase()) as any;

  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id) as any[];
  res.json(parseOrder(order, items));
});

// ─── Admin: list all orders ───────────────────────────────────────────────────
router.get('/', authenticate, requireAdmin, (req: Request, res: Response) => {
  const db = getDb();
  const { status, page = '1', limit = '20' } = req.query as Record<string, string>;

  const conditions = status ? ['status = ?'] : [];
  const params: any[] = status ? [status] : [];

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const total = (db.prepare(`SELECT COUNT(*) as count FROM orders ${where}`).get(...params) as any).count;
  const orders = db.prepare(`SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limitNum, offset) as any[];

  const result = orders.map((order) => {
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id) as any[];
    return parseOrder(order, items);
  });

  res.json({
    orders: result,
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
  });
});

// ─── Admin: update order status ───────────────────────────────────────────────
router.patch(
  '/:id/status',
  authenticate,
  requireAdmin,
  [body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const db = getDb();
    const result = db.prepare(
      "UPDATE orders SET status = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(req.body.status, req.params.id);

    if (result.changes === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id) as any;
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id) as any[];
    res.json(parseOrder(order, items));
  }
);

export default router;
