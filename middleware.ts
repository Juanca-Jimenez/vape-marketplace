import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const AGE_GATE_PATH = '/verificar-edad'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: () => {},
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  const isPublicPath = pathname === '/verificar-edad' || pathname.startsWith('/admin/login')
  const cookieHeader = request.headers.get('cookie') ?? ''
  const ageVerified = cookieHeader.includes('age_verified=true') || request.cookies.get('age_verified')?.value === 'true'

  if (!isPublicPath && !ageVerified) {
    const url = new URL(AGE_GATE_PATH, request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
