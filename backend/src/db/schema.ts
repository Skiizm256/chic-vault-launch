// Database schema definitions — all SQL DDL statements for Chic Vault

export const SCHEMA_SQL = `
PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- ─── Users ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','admin')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Addresses ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label       TEXT NOT NULL DEFAULT 'Home',
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  address     TEXT NOT NULL,
  city        TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country     TEXT NOT NULL DEFAULT 'US',
  phone       TEXT,
  is_default  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Products ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  price            REAL NOT NULL,
  original_price   REAL,
  category         TEXT NOT NULL CHECK(category IN ('women','men','accessories','new')),
  subcategory      TEXT NOT NULL,
  colors           TEXT NOT NULL DEFAULT '[]',   -- JSON array
  sizes            TEXT NOT NULL DEFAULT '[]',   -- JSON array
  images           TEXT NOT NULL DEFAULT '[]',   -- JSON array
  description      TEXT NOT NULL,
  details          TEXT NOT NULL DEFAULT '[]',   -- JSON array
  is_new           INTEGER NOT NULL DEFAULT 0,
  is_sale          INTEGER NOT NULL DEFAULT 0,
  rating           REAL NOT NULL DEFAULT 0,
  reviews          INTEGER NOT NULL DEFAULT 0,
  stock            INTEGER NOT NULL DEFAULT 100,
  is_active        INTEGER NOT NULL DEFAULT 1,
  created_at       TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Wishlist ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlist (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, product_id)
);

-- ─── Orders ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id              TEXT PRIMARY KEY,
  user_id         TEXT REFERENCES users(id) ON DELETE SET NULL,
  email           TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK(status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  subtotal        REAL NOT NULL,
  shipping_cost   REAL NOT NULL DEFAULT 0,
  total           REAL NOT NULL,
  shipping_info   TEXT NOT NULL DEFAULT '{}',  -- JSON: name, address, city, postal, country, phone
  payment_info    TEXT NOT NULL DEFAULT '{}',  -- JSON: method, last4, status
  notes           TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Order Items ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id             TEXT PRIMARY KEY,
  order_id       TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id     TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  product_name   TEXT NOT NULL,   -- snapshot at time of order
  product_price  REAL NOT NULL,   -- snapshot
  quantity       INTEGER NOT NULL,
  selected_size  TEXT NOT NULL,
  selected_color TEXT NOT NULL,
  line_total     REAL NOT NULL
);

-- ─── Newsletter ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter (
  id         TEXT PRIMARY KEY,
  email      TEXT UNIQUE NOT NULL,
  is_active  INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ─── Reviews ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id         TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id   TEXT REFERENCES orders(id) ON DELETE SET NULL,
  rating     INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
  title      TEXT,
  body       TEXT,
  is_verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(product_id, user_id)
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_user     ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status   ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_ord ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user   ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_products_cat    ON products(category);
`;
