import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { notFound } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import ClientLayout from '@/components/Layout/ClientLayout';
import '@/globals.css';
const inter = Inter({ subsets: ['latin'] });

const languages = ['en', 'ar'];

export const metadata: Metadata = {
  title: 'Cmon Elsonon - Luxury Egyptian Cotton Bedding',
  description: 'Unwind, Relax & Enjoy Luxury Sleep - Premium Egyptian Cotton Bedding',
};

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params; // Await params to access lang
  if (!languages.includes(lang)) {
    notFound();
  }

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ClientLayout lang={lang}>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}