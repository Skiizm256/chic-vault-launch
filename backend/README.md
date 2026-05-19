# Chic Vault — Backend API

A full REST API for the MAISON luxury fashion store, built with **Express + TypeScript + SQLite (better-sqlite3)**.

---

## Quick Start

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Copy env file and configure
cp .env.example .env
# Edit .env — at minimum set a strong JWT_SECRET

# 3. Seed the database (products + demo users)
npm run db:init   # (or: npx tsx src/db/seed.ts)

# 4. Start dev server
npm run dev
```

The API will be available at **http://localhost:3001**

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `JWT_SECRET` | *(required)* | Secret for signing JWTs — must be changed in production |
| `JWT_EXPIRES_IN` | `7d` | JWT expiry |
| `NODE_ENV` | `development` | Environment |
| `FRONTEND_URL` | `http://localhost:5173` | Allowed CORS origin |
| `DB_PATH` | `./chic-vault.db` | SQLite file path |

---

## API Reference

### Health
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Create account |
| POST | `/login` | — | Login, returns JWT |
| GET | `/me` | ✅ | Get current user |
| PUT | `/me` | ✅ | Update profile / change password |
| GET | `/me/addresses` | ✅ | List saved addresses |
| POST | `/me/addresses` | ✅ | Add address |

### Products — `/api/products`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | — | List / search products |
| GET | `/:id` | — | Get single product + reviews |
| POST | `/` | 🔒 Admin | Create product |
| PUT | `/:id` | 🔒 Admin | Update product |
| DELETE | `/:id` | 🔒 Admin | Soft-delete product |
| POST | `/:id/reviews` | ✅ | Submit review |

**Query params for GET /products:**
- `category` — `women` / `men` / `accessories` / `new`
- `sale=true`
- `minPrice` / `maxPrice`
- `q` — full-text search
- `sort` — `price_asc` / `price_desc` / `newest` / `rating`
- `page` / `limit`

### Orders — `/api/orders`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Optional | Place an order |
| GET | `/my` | ✅ | Get my orders |
| GET | `/:id` | ✅ | Get single order |
| POST | `/lookup` | — | Guest order lookup |
| GET | `/` | 🔒 Admin | All orders |
| PATCH | `/:id/status` | 🔒 Admin | Update order status |

### Wishlist — `/api/wishlist`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | ✅ | Get wishlist |
| POST | `/:productId` | ✅ | Add to wishlist |
| DELETE | `/:productId` | ✅ | Remove from wishlist |
| PUT | `/:productId/toggle` | ✅ | Toggle in/out |

### Newsletter — `/api/newsletter`
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/subscribe` | — | Subscribe |
| POST | `/unsubscribe` | — | Unsubscribe |
| GET | `/` | 🔒 Admin | List subscribers |

### Admin — `/api/admin`
| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/stats` | 🔒 Admin | Dashboard statistics |
| GET | `/users` | 🔒 Admin | List all users |

---

## Demo Users (seeded)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@maisonstore.com` | `admin123` |
| Customer | `jane@example.com` | `customer123` |

---

## Database Schema

- **users** — accounts with bcrypt-hashed passwords
- **addresses** — saved shipping addresses per user
- **products** — full product catalog with stock
- **orders** — order records with shipping/payment snapshots
- **order_items** — line items per order
- **wishlist** — user ↔ product many-to-many
- **newsletter** — email subscriber list
- **reviews** — product reviews with verified purchase flag

---

## Production Checklist

- [ ] Set a strong random `JWT_SECRET`
- [ ] Set `NODE_ENV=production`
- [ ] Set `FRONTEND_URL` to your actual domain
- [ ] Move DB to a persistent volume (or switch to PostgreSQL)
- [ ] Enable HTTPS (nginx / Caddy in front)
- [ ] Integrate a real payment provider (Stripe recommended)
- [ ] Set up email sending for order confirmations
