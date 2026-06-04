import { notFound } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import ClientLayout from '@/components/Layout/ClientLayout'
import '@/globals.css'
const languages = ['en', 'ar']

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  if (!languages.includes(lang)) {
    notFound()
  }

  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}
        >
          <ClientLayout lang={lang}>
            {children}
          </ClientLayout >
        </ThemeProvider>
      </body>
    </html>
  )
}