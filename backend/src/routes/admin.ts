import { Router, Request, Response } from 'express';
import { getDb } from '../db/database.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(authenticate, requireAdmin);

// ─── Dashboard stats ──────────────────────────────────────────────────────────
router.get('/stats', (req: Request, res: Response) => {
  const db = getDb();

  const totalOrders = (db.prepare('SELECT COUNT(*) as c FROM orders').get() as any).c;
  const totalRevenue = (db.prepare("SELECT COALESCE(SUM(total),0) as r FROM orders WHERE status != 'cancelled'").get() as any).r;
  const totalCustomers = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role='customer'").get() as any).c;
  const totalProducts = (db.prepare('SELECT COUNT(*) as c FROM products WHERE is_active=1').get() as any).c;
  const totalSubscribers = (db.prepare('SELECT COUNT(*) as c FROM newsletter WHERE is_active=1').get() as any).c;

  const recentOrders = db.prepare(`
    SELECT o.id, o.email, o.total, o.status, o.created_at,
           u.first_name, u.last_name
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT 10
  `).all() as any[];

  const ordersByStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM orders GROUP BY status
  `).all() as any[];

  const topProducts = db.prepare(`
    SELECT oi.product_name, SUM(oi.quantity) as units_sold, SUM(oi.line_total) as revenue
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.status != 'cancelled'
    GROUP BY oi.product_id, oi.product_name
    ORDER BY units_sold DESC
    LIMIT 5
  `).all() as any[];

  res.json({
    summary: {
      totalOrders,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalCustomers,
      totalProducts,
      totalSubscribers,
    },
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      email: o.email,
      customerName: o.first_name ? `${o.first_name} ${o.last_name}` : 'Guest',
      total: o.total,
      status: o.status,
      createdAt: o.created_at,
    })),
    ordersByStatus,
    topProducts,
  });
});

// ─── List all users ───────────────────────────────────────────────────────────
router.get('/users', (req: Request, res: Response) => {
  const db = getDb();
  const { page = '1', limit = '20', q } = req.query as Record<string, string>;

  const conditions: string[] = [];
  const params: any[] = [];

  if (q) {
    conditions.push('(email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const offset = (pageNum - 1) * limitNum;

  const total = (db.prepare(`SELECT COUNT(*) as count FROM users ${where}`).get(...params) as any).count;
  const users = db.prepare(`
    SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.created_at,
           COUNT(o.id) as order_count, COALESCE(SUM(o.total),0) as lifetime_value
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id AND o.status != 'cancelled'
    ${where}
    GROUP BY u.id
    ORDER BY u.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, limitNum, offset) as any[];

  res.json({
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      firstName: u.first_name,
      lastName: u.last_name,
      role: u.role,
      createdAt: u.created_at,
      orderCount: u.order_count,
      lifetimeValue: Math.round(u.lifetime_value * 100) / 100,
    })),
    pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
  });
});

export default router;
