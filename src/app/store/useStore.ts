'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, User } from '../types';
import { toast } from 'react-hot-toast';

interface StoreState {
  // Cart
  cart: CartItem[];
  cartOpen: boolean;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  syncCart: () => void;

  // User
  user: User | null;
  accessToken: string | null;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;

  // Wishlist
  wishlist: Product[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  syncWishlist: () => void;

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
      addToCart: async (product, size, color, quantity = 1) => {
        const { accessToken } = get();
        if (!accessToken) {
          toast.error('You must be logged in to add items to the cart.');
          return;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ productId: product.id, quantity, selectedSize: size, selectedColor: color }),
          });

          if (!response.ok) {
            throw new Error('Failed to add item to cart');
          }

          get().syncCart();
        } catch (error) {
          toast.error(error.message);
        }
      },

      removeFromCart: async (productId) => {
        const { accessToken } = get();
        if (!accessToken) return;

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to remove item from cart');
          }

          get().syncCart();
        } catch (error) {
          toast.error(error.message);
        }
      },

      updateQuantity: async (productId, quantity) => {
        const { accessToken } = get();
        if (!accessToken) return;

        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ quantity }),
          });

          if (!response.ok) {
            throw new Error('Failed to update item quantity');
          }

          get().syncCart();
        } catch (error) {
          toast.error(error.message);
        }
      },

      clearCart: () => {
        // This should also be synced with the backend, but for now we'll just clear the local state.
        set({ cart: [] });
      },
      setCartOpen: (open) => set({ cartOpen: open }),

      syncCart: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ cart: [] });
          return;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch cart');
          }

          const backendCart = await response.json();
          const frontendCart: CartItem[] = backendCart.map((item: any) => ({
            id: item.productId,
            product: item.product,
            quantity: item.quantity,
            size: item.selectedSize,
            color: item.selectedColor,
          }));
          set({ cart: frontendCart });
        } catch (error) {
          console.error(error.message);
          set({ cart: [] });
        }
      },

      // User
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),

      // Wishlist
      wishlist: [],
      addToWishlist: async (productId) => {
        const { accessToken } = get();
        if (!accessToken) {
          toast.error('You must be logged in to add items to the wishlist.');
          return;
        }
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ productId }),
          });

          if (!response.ok) {
            throw new Error('Failed to add item to wishlist');
          }
          get().syncWishlist();
        } catch (error) {
          toast.error(error.message);
        }
      },
      removeFromWishlist: async (productId) => {
        const { accessToken } = get();
        if (!accessToken) return;

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist/${productId}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to remove item from wishlist');
          }
          get().syncWishlist();
        } catch (error) {
          toast.error(error.message);
        }
      },
      syncWishlist: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ wishlist: [] });
          return;
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch wishlist');
          }

          const backendWishlist = await response.json();
          const frontendWishlist: Product[] = backendWishlist.map((item: any) => item.product);
          set({ wishlist: frontendWishlist });
        } catch (error) {
          console.error(error.message);
          set({ wishlist: [] });
        }
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
        accessToken: state.accessToken,
        theme: state.theme,
      }),
    }
  )
);