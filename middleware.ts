import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const verified = req.cookies.get('age_verified')
  const pathname = req.nextUrl.pathname

  const isExcluded =
    pathname.startsWith('/verificar-edad') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')

  if (!verified && !isExcluded) {
    return NextResponse.redirect(new URL('/verificar-edad', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}