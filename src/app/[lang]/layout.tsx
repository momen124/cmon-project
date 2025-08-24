import { notFound } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import ClientLayout from '@/components/Layout/ClientLayout'
import '@/globals.css'
const languages = ['en', 'ar']

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }))
}

export default function LangLayout({
  children,
  params: { lang }
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
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