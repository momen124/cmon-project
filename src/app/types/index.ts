export interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  price: number;
  stock: number;
  category_id: string;
  sizes: object;
  colors: object;
  images: string[];
  view_count: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  loyaltyPoints?: number;
  totalOrders?: number;
  totalSpent?: number;
  memberSince?: string;
  orders?: Order[];
  wishlist?: Product[];
  addresses?: Address[];
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  governorate: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  user: User;
  orderItems: OrderItem[];
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_info: any;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
}