import { NextResponse, type NextRequest } from 'next/server'

const AGE_GATE_PATH = '/verificar-edad'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const isPublicPath = pathname === '/' || pathname.startsWith('/verificar-edad')
  const ageVerified = request.cookies.get('age_verified')?.value === 'true'

  if (!isPublicPath && !ageVerified) {
    const url = new URL(AGE_GATE_PATH, request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
