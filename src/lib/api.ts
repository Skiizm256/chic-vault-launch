/**
 * API client for the Chic Vault backend
 * Automatically uses local backend in dev and a configurable URL in production.
 */

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

// ─── Auth helpers ─────────────────────────────────────────────────────────────
const TOKEN_KEY = 'chic-vault-token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Base fetch wrapper ───────────────────────────────────────────────────────
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> ?? {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => request<{ token: string; user: User }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  login: (email: string, password: string) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<User>('/auth/me'),

  updateProfile: (data: Partial<{
    firstName: string;
    lastName: string;
    currentPassword: string;
    newPassword: string;
  }>) => request<User>('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),

  getAddresses: () => request<Address[]>('/auth/me/addresses'),

  addAddress: (data: Omit<Address, 'id' | 'userId' | 'createdAt'>) =>
    request<Address>('/auth/me/addresses', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Products API ─────────────────────────────────────────────────────────────
export const productsApi = {
  list: (params?: {
    category?: string;
    sale?: boolean;
    minPrice?: number;
    maxPrice?: number;
    q?: string;
    page?: number;
    limit?: number;
    sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating';
  }) => {
    const qs = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
      });
    }
    const query = qs.toString();
    return request<{ products: Product[]; pagination: Pagination }>(
      `/products${query ? `?${query}` : ''}`
    );
  },

  get: (id: string) => request<Product>(`/products/${id}`),
};

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersApi = {
  place: (data: {
    email: string;
    items: { productId: string; quantity: number; selectedSize: string; selectedColor: string }[];
    shippingInfo: ShippingInfo;
    paymentInfo?: { method: string; last4?: string };
    notes?: string;
  }) => request<{ message: string; order: Order }>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  myOrders: () => request<Order[]>('/orders/my'),

  get: (id: string) => request<Order>(`/orders/${id}`),

  lookup: (orderId: string, email: string) =>
    request<Order>('/orders/lookup', {
      method: 'POST',
      body: JSON.stringify({ orderId, email }),
    }),
};

// ─── Wishlist API ─────────────────────────────────────────────────────────────
export const wishlistApi = {
  list: () => request<WishlistItem[]>('/wishlist'),
  toggle: (productId: string) =>
    request<{ inWishlist: boolean; message: string }>(`/wishlist/${productId}/toggle`, {
      method: 'PUT',
    }),
  add: (productId: string) =>
    request<{ id: string }>(`/wishlist/${productId}`, { method: 'POST' }),
  remove: (productId: string) =>
    request<{ message: string }>(`/wishlist/${productId}`, { method: 'DELETE' }),
};

// ─── Newsletter API ───────────────────────────────────────────────────────────
export const newsletterApi = {
  subscribe: (email: string) =>
    request<{ message: string }>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  unsubscribe: (email: string) =>
    request<{ message: string }>('/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  createdAt?: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: string;
}

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
  stock?: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  lineTotal: number;
}

export interface Order {
  id: string;
  userId?: string;
  email: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingInfo: ShippingInfo;
  paymentInfo: { method: string; last4: string; status: string };
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface WishlistItem {
  wishlistId: string;
  wishlistedAt: string;
  product: Product;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
