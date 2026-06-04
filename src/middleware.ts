import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const languages = ['en', 'ar']
const defaultLang = 'en'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLang = languages.some((lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`)

  if (pathnameHasLang) return NextResponse.next()

  // Detect locale from Accept-Language header
  const acceptLang = request.headers.get('accept-language')?.split(',')[0].split('-')[0] || defaultLang
  const redirectLang = languages.includes(acceptLang) ? acceptLang : defaultLang

  request.nextUrl.pathname = `/${redirectLang}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'],
}