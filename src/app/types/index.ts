export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: string;
  categoryAr?: string;
  subcategory?: string;
  sizes: { name: string; cm: string }[];
  colors: {
    name: string;
    nameAr: string;
    hex: string;
    image: any;
  }[];
  images: any[];
  view_count?: number;
  threadCount?: number;
  material: string;
  materialAr?: string;
  careInstructions?: string;
  careInstructionsAr?: string;
  featured?: boolean;
  bestseller?: boolean;
  newArrival?: boolean;
  rating?: number;
  reviewCount?: number;
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
  name: string;
  nameAr: string;
  slug: string;
  children?: {
    id: string;
    name: string;
    nameAr: string;
    slug: string;
  }[];
}