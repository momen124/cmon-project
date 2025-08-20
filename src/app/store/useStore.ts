import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, User } from '../types';

interface StoreState {
  // Cart
  cart: CartItem[];
  cartOpen: boolean;
  addToCart: (product: Product, size: string, color: any, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;

  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Wishlist
  wishlist: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;

  // Language
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;

  // Currency
  currency: 'EGP' | 'USD' | 'EUR';
  setCurrency: (currency: 'EGP' | 'USD' | 'EUR') => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      cartOpen: false,
      addToCart: (product, size, color, quantity = 1) => {
        const existingItem = get().cart.find(
          (item) =>
            item.product.id === product.id &&
            item.size === size &&
            item.color.name === color.name
        );

        if (existingItem) {
          set((state) => ({
            cart: state.cart.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          }));
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${size}-${color.name}-${Date.now()}`,
            product,
            quantity,
            size,
            color,
          };
          set((state) => ({ cart: [...state.cart, newItem] }));
        }
      },

      removeFromCart: (id) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),
      setCartOpen: (open) => set({ cartOpen: open }),

      // User
      user: null,
      setUser: (user) => set({ user }),

      // Wishlist
      wishlist: [],
      addToWishlist: (productId) => {
        set((state) => ({
          wishlist: [...state.wishlist, productId],
        }));
      },
      removeFromWishlist: (productId) => {
        set((state) => ({
          wishlist: state.wishlist.filter((id) => id !== productId),
        }));
      },

      // Language
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

      // Currency
      currency: 'EGP',
      setCurrency: (currency) => set({ currency }),

      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'cmon-elsonon-store',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        language: state.language,
        currency: state.currency,
        user: state.user,
        theme: state.theme,
      }),
    }
  )
);