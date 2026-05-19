/**
 * Seeds the database with the Chic Vault product catalog
 * Run once: npx tsx src/db/seed.ts
 */
import { getDb } from './database.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const db = getDb();

const products = [
  {
    id: '1',
    name: 'Oversized Linen Blazer',
    price: 189,
    original_price: 249,
    category: 'women',
    subcategory: 'outerwear',
    colors: ['#E8DFD5', '#1A1A1A', '#8B7355'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg'],
    description: 'A relaxed-fit linen blazer perfect for effortless layering. Crafted from premium European linen with a soft, breathable texture.',
    details: ['100% European Linen', 'Relaxed fit', 'Two-button closure', 'Patch pockets', 'Dry clean only'],
    is_new: 0,
    is_sale: 1,
    rating: 4.8,
    reviews: 124,
    stock: 45,
  },
  {
    id: '2',
    name: 'Cashmere Crew Sweater',
    price: 295,
    original_price: null,
    category: 'women',
    subcategory: 'knitwear',
    colors: ['#F5E6D3', '#C9B8A8', '#2C2C2C'],
    sizes: ['XS', 'S', 'M', 'L'],
    images: ['/placeholder.svg'],
    description: 'Luxuriously soft cashmere sweater with a classic crew neckline. Perfect for transitional weather.',
    details: ['100% Grade-A Cashmere', 'Regular fit', 'Ribbed trim', 'Hand wash cold'],
    is_new: 1,
    is_sale: 0,
    rating: 4.9,
    reviews: 89,
    stock: 30,
  },
  {
    id: '3',
    name: 'Wide-Leg Wool Trousers',
    price: 175,
    original_price: null,
    category: 'women',
    subcategory: 'pants',
    colors: ['#2C2C2C', '#8B7355', '#E8E8E8'],
    sizes: ['0', '2', '4', '6', '8', '10', '12'],
    images: ['/placeholder.svg'],
    description: 'Elevated wide-leg trousers in premium wool blend. Features a high waist and clean pleating.',
    details: ['70% Wool, 30% Polyester', 'High rise', 'Wide leg', 'Side zip closure'],
    is_new: 0,
    is_sale: 0,
    rating: 4.7,
    reviews: 156,
    stock: 60,
  },
  {
    id: '4',
    name: 'Cotton Poplin Shirt',
    price: 98,
    original_price: null,
    category: 'men',
    subcategory: 'shirts',
    colors: ['#FFFFFF', '#E8F4F8', '#1A1A1A'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/placeholder.svg'],
    description: 'Crisp cotton poplin shirt with a modern relaxed fit. A versatile wardrobe essential.',
    details: ['100% Cotton Poplin', 'Relaxed fit', 'Button-down collar', 'Machine washable'],
    is_new: 0,
    is_sale: 0,
    rating: 4.6,
    reviews: 203,
    stock: 80,
  },
  {
    id: '5',
    name: 'Leather Chelsea Boots',
    price: 385,
    original_price: null,
    category: 'accessories',
    subcategory: 'footwear',
    colors: ['#2C2C2C', '#5C4033'],
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    images: ['/placeholder.svg'],
    description: 'Handcrafted leather Chelsea boots with a sleek silhouette. Italian craftsmanship meets modern design.',
    details: ['Full-grain leather upper', 'Leather sole', 'Elastic side panels', 'Made in Italy'],
    is_new: 1,
    is_sale: 0,
    rating: 4.9,
    reviews: 67,
    stock: 25,
  },
  {
    id: '6',
    name: 'Silk Midi Dress',
    price: 345,
    original_price: 425,
    category: 'women',
    subcategory: 'dresses',
    colors: ['#D4A574', '#8B5A2B', '#1A1A1A'],
    sizes: ['XS', 'S', 'M', 'L'],
    images: ['/placeholder.svg'],
    description: 'Elegant silk midi dress with a fluid silhouette. Features delicate draping and a flattering cut.',
    details: ['100% Mulberry Silk', 'Midi length', 'Hidden back zip', 'Dry clean only'],
    is_new: 0,
    is_sale: 1,
    rating: 4.8,
    reviews: 92,
    stock: 18,
  },
  {
    id: '7',
    name: 'Merino Wool Cardigan',
    price: 225,
    original_price: null,
    category: 'men',
    subcategory: 'knitwear',
    colors: ['#2C3E50', '#8B7355', '#E8DFD5'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg'],
    description: 'Premium merino wool cardigan with a refined button front. Perfect for layering.',
    details: ['100% Extra-fine Merino Wool', 'Regular fit', 'V-neck', 'Button closure'],
    is_new: 0,
    is_sale: 0,
    rating: 4.7,
    reviews: 78,
    stock: 40,
  },
  {
    id: '8',
    name: 'Leather Tote Bag',
    price: 445,
    original_price: null,
    category: 'accessories',
    subcategory: 'bags',
    colors: ['#8B5A2B', '#1A1A1A', '#E8DFD5'],
    sizes: ['One Size'],
    images: ['/placeholder.svg'],
    description: 'Structured leather tote with a spacious interior. Crafted from vegetable-tanned leather.',
    details: ['Vegetable-tanned leather', 'Cotton lining', 'Interior pockets', 'Magnetic closure'],
    is_new: 1,
    is_sale: 0,
    rating: 4.9,
    reviews: 45,
    stock: 15,
  },
];

const insertProduct = db.prepare(`
  INSERT OR REPLACE INTO products
    (id, name, price, original_price, category, subcategory, colors, sizes, images,
     description, details, is_new, is_sale, rating, reviews, stock)
  VALUES
    (@id, @name, @price, @original_price, @category, @subcategory, @colors, @sizes, @images,
     @description, @details, @is_new, @is_sale, @rating, @reviews, @stock)
`);

const seedProducts = db.transaction(() => {
  for (const p of products) {
    insertProduct.run({
      ...p,
      colors: JSON.stringify(p.colors),
      sizes: JSON.stringify(p.sizes),
      images: JSON.stringify(p.images),
      details: JSON.stringify(p.details),
    });
  }
});

seedProducts();
console.log(`✅ Seeded ${products.length} products`);

// Seed a demo admin user
const adminId = uuidv4();
const adminHash = bcrypt.hashSync('admin123', 10);
db.prepare(`
  INSERT OR IGNORE INTO users (id, email, password, first_name, last_name, role)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(adminId, 'admin@maisonstore.com', adminHash, 'Admin', 'User', 'admin');

console.log('✅ Seeded admin user → admin@maisonstore.com / admin123');

// Seed a demo customer
const customerId = uuidv4();
const customerHash = bcrypt.hashSync('customer123', 10);
db.prepare(`
  INSERT OR IGNORE INTO users (id, email, password, first_name, last_name, role)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(customerId, 'jane@example.com', customerHash, 'Jane', 'Doe', 'customer');

console.log('✅ Seeded demo customer → jane@example.com / customer123');
console.log('\nDatabase seeding complete!');
