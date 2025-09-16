'use client';

import React, { ReactNode, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '../common/Header';
import Footer from '../common/Footer';
import CartSidebar from '../Cart/CartSidebar';
import { Toaster } from 'react-hot-toast';
import { useStore } from '@/app/store/useStore';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const params = useParams();
  const lang = params?.lang as string;
  const { syncCart, user } = useStore();

  useEffect(() => {
    // Set the language and direction attributes on the document
    if (lang) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [lang]);

  useEffect(() => {
    syncCart();
  }, [user, syncCart]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background-color)] text-[var(--text-color)]">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartSidebar />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-[var(--card-bg-color)] text-[var(--text-color)] border border-[var(--border-color)]',
          duration: 3000,
        }}
      />
    </div>
  );
}