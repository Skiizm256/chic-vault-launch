# MAISON — Chic Vault

A luxury fashion e-commerce application with a full-stack React + Express architecture.

---

## Project Structure

```
chic-vault/
├── src/                     # React frontend (Vite + TypeScript)
│   ├── components/
│   │   ├── home/            # Hero, Categories, Featured, Promo, BrandFeatures
│   │   ├── layout/          # Header, Footer
│   │   └── product/         # ProductCard, ProductFilters
│   ├── context/
│   │   ├── AuthContext.tsx  # Login / register / session
│   │   └── CartContext.tsx  # Cart with localStorage persistence
│   ├── lib/
│   │   └── api.ts           # Full typed API client
│   └── pages/
│       ├── Index.tsx
│       ├── Products.tsx
│       ├── ProductDetail.tsx
│       ├── Cart.tsx
│       ├── Checkout.tsx     # 2-step: shipping → payment → real API order
│       ├── OrderConfirmation.tsx
│       ├── Account.tsx      # Login / register / orders dashboard
│       ├── StaticPage.tsx   # About, Contact, FAQ, Shipping, etc.
│       └── NotFound.tsx
│
└── backend/                 # Express API (TypeScript + SQLite)
    ├── src/
    │   ├── db/
    │   │   ├── database.ts  # DB connection singleton
    │   │   ├── schema.ts    # All CREATE TABLE statements
    │   │   └── seed.ts      # Seed products + demo users
    │   ├── middleware/
    │   │   └── auth.ts      # JWT authenticate / requireAdmin / optionalAuth
    │   ├── routes/
    │   │   ├── auth.ts      # Register, login, profile, addresses
    │   │   ├── products.ts  # CRUD + reviews
    │   │   ├── orders.ts    # Place, track, admin manage
    │   │   ├── wishlist.ts  # Toggle, list, remove
    │   │   ├── newsletter.ts
    │   │   └── admin.ts     # Stats, user management
    │   └── index.ts         # Express app entry
    └── README.md            # Full API reference
```

---

## Running Locally

### Frontend

```bash
npm install
npm run dev
# → http://localhost:5173
```

### Backend

```bash
cd backend
npm install
cp .env.example .env   # Edit JWT_SECRET at minimum
npx tsx src/db/seed.ts # Seed DB once
npm run dev            # → http://localhost:3001
```

Both must run simultaneously for the full experience. The frontend gracefully degrades (uses static data) if the backend is offline.

---

## What Was Fixed

| Issue | Fix |
|---|---|
| Cart wiped on page refresh | localStorage persistence added to CartContext |
| NotFound used `<a>` instead of `<Link>` | Fixed to use React Router Link |
| Footer newsletter had no handler | Connected to backend `/api/newsletter/subscribe` |
| `/account` route missing | Full login/register/orders Account page |
| Checkout had no real backend | Connected to `/api/orders`, navigates to OrderConfirmation |
| No OrderConfirmation page | Created with full order summary |
| Footer links broken (contact, about, etc.) | All 10 static pages created via StaticPage.tsx |
| Checkout had no form validation | All fields validated, card formatted live |
| No auth system | Full JWT auth context + Account page |
| No order persistence | Orders saved to DB with full schema |
| No wishlist persistence | Wishlist API + toggle endpoint |
| Payment fields not formatted | Card number / expiry formatted as user types |

## What the Backend Adds

| Feature | Details |
|---|---|
| **Authentication** | Register, login, JWT sessions, profile update, address book |
| **Products API** | Full CRUD, search, filter, sort, pagination |
| **Orders** | Place orders, stock management, guest lookup, order history |
| **Wishlist** | Per-user persistent wishlist with toggle |
| **Reviews** | Submit reviews, verified purchase badge, rating auto-update |
| **Newsletter** | Subscribe / unsubscribe with dedup |
| **Admin** | Dashboard stats, all orders, user list, order status updates |
| **Security** | Helmet, CORS, rate limiting, bcrypt passwords, JWT, input validation |
