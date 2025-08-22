import { notFound } from 'next/navigation'
import ClientLayout from '@/components/Layout/ClientLayout'

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
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}