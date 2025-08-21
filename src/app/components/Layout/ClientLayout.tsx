'use client';

import React, { ReactNode } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';



export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1 text-[var(--text-color)]">
        {children}
      </main>
      <Footer />
    </>
  );
}