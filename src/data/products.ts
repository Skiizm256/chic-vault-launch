export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'women' | 'men' | 'accessories' | 'new';
  subcategory: string;
  colors: string[];
  sizes: string[];
  images: string[];
  description: string;
  details: string[];
  isNew?: boolean;
  isSale?: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Oversized Linen Blazer',
    price: 189,
    originalPrice: 249,
    category: 'women',
    subcategory: 'outerwear',
    colors: ['#E8DFD5', '#1A1A1A', '#8B7355'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg'],
    description: 'A relaxed-fit linen blazer perfect for effortless layering. Crafted from premium European linen with a soft, breathable texture.',
    details: ['100% European Linen', 'Relaxed fit', 'Two-button closure', 'Patch pockets', 'Dry clean only'],
    isSale: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    id: '2',
    name: 'Cashmere Crew Sweater',
    price: 295,
    category: 'women',
    subcategory: 'knitwear',
    colors: ['#F5E6D3', '#C9B8A8', '#2C2C2C'],
    sizes: ['XS', 'S', 'M', 'L'],
    images: ['/placeholder.svg'],
    description: 'Luxuriously soft cashmere sweater with a classic crew neckline. Perfect for transitional weather.',
    details: ['100% Grade-A Cashmere', 'Regular fit', 'Ribbed trim', 'Hand wash cold'],
    isNew: true,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: '3',
    name: 'Wide-Leg Wool Trousers',
    price: 175,
    category: 'women',
    subcategory: 'pants',
    colors: ['#2C2C2C', '#8B7355', '#E8E8E8'],
    sizes: ['0', '2', '4', '6', '8', '10', '12'],
    images: ['/placeholder.svg'],
    description: 'Elevated wide-leg trousers in premium wool blend. Features a high waist and clean pleating.',
    details: ['70% Wool, 30% Polyester', 'High rise', 'Wide leg', 'Side zip closure'],
    rating: 4.7,
    reviews: 156,
  },
  {
    id: '4',
    name: 'Cotton Poplin Shirt',
    price: 98,
    category: 'men',
    subcategory: 'shirts',
    colors: ['#FFFFFF', '#E8F4F8', '#1A1A1A'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: ['/placeholder.svg'],
    description: 'Crisp cotton poplin shirt with a modern relaxed fit. A versatile wardrobe essential.',
    details: ['100% Cotton Poplin', 'Relaxed fit', 'Button-down collar', 'Machine washable'],
    rating: 4.6,
    reviews: 203,
  },
  {
    id: '5',
    name: 'Leather Chelsea Boots',
    price: 385,
    category: 'accessories',
    subcategory: 'footwear',
    colors: ['#2C2C2C', '#5C4033'],
    sizes: ['36', '37', '38', '39', '40', '41', '42'],
    images: ['/placeholder.svg'],
    description: 'Handcrafted leather Chelsea boots with a sleek silhouette. Italian craftsmanship meets modern design.',
    details: ['Full-grain leather upper', 'Leather sole', 'Elastic side panels', 'Made in Italy'],
    isNew: true,
    rating: 4.9,
    reviews: 67,
  },
  {
    id: '6',
    name: 'Silk Midi Dress',
    price: 345,
    originalPrice: 425,
    category: 'women',
    subcategory: 'dresses',
    colors: ['#D4A574', '#8B5A2B', '#1A1A1A'],
    sizes: ['XS', 'S', 'M', 'L'],
    images: ['/placeholder.svg'],
    description: 'Elegant silk midi dress with a fluid silhouette. Features delicate draping and a flattering cut.',
    details: ['100% Mulberry Silk', 'Midi length', 'Hidden back zip', 'Dry clean only'],
    isSale: true,
    rating: 4.8,
    reviews: 92,
  },
  {
    id: '7',
    name: 'Merino Wool Cardigan',
    price: 225,
    category: 'men',
    subcategory: 'knitwear',
    colors: ['#2C3E50', '#8B7355', '#E8DFD5'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/placeholder.svg'],
    description: 'Premium merino wool cardigan with a refined button front. Perfect for layering.',
    details: ['100% Extra-fine Merino Wool', 'Regular fit', 'V-neck', 'Button closure'],
    rating: 4.7,
    reviews: 78,
  },
  {
    id: '8',
    name: 'Leather Tote Bag',
    price: 445,
    category: 'accessories',
    subcategory: 'bags',
    colors: ['#8B5A2B', '#1A1A1A', '#E8DFD5'],
    sizes: ['One Size'],
    images: ['/placeholder.svg'],
    description: 'Structured leather tote with a spacious interior. Crafted from vegetable-tanned leather.',
    details: ['Vegetable-tanned leather', 'Cotton lining', 'Interior pockets', 'Magnetic closure'],
    isNew: true,
    rating: 4.9,
    reviews: 45,
  },
];

export const categories = [
  { id: 'women', name: 'Women', count: 156 },
  { id: 'men', name: 'Men', count: 124 },
  { id: 'accessories', name: 'Accessories', count: 89 },
  { id: 'new', name: 'New Arrivals', count: 42 },
];

export const filters = {
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  colors: [
    { name: 'Black', value: '#1A1A1A' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Cream', value: '#E8DFD5' },
    { name: 'Brown', value: '#8B7355' },
    { name: 'Navy', value: '#2C3E50' },
  ],
  priceRanges: [
    { label: 'Under $100', min: 0, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $300', min: 200, max: 300 },
    { label: 'Over $300', min: 300, max: Infinity },
  ],
};
