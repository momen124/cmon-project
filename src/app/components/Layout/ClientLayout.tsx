'use client';

import { useTranslation } from 'react-i18next';
import '@/i18n'; // Use absolute path based on tsconfig.json alias
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useEffect } from 'react';

export default function ClientLayout({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang); // Sync i18n language with route param
  }, [lang, i18n]);

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}