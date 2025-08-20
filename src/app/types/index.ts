

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  categoryAr: string;
  subcategory?: string;
  sizes: Size[];
  colors: ProductColor[];
  stock: number;
  threadCount?: number;
  material: string;
  materialAr: string;
  careInstructions: string;
  careInstructionsAr: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  rating: number;
  reviewCount: number;
  comparePrice?: number;
}

interface Size {
  name: string;
  cm: string;
}


export interface ProductColor {
  name: string;
  nameAr: string;
  hex: string;
  image: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string;
  color: ProductColor;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: Address[];
  orders: Order[];
  wishlist: string[];
  loyaltyPoints: number;
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

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  children?: Category[];
  image?: string;
  description?: string;
}