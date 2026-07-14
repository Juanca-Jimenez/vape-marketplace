import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const AGE_GATE_PATH = '/verificar-edad'

function normalizeSupabaseUrl(url: string | undefined): string {
  if (!url) return ''
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/i, '')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static assets and API routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  const roleCookie = request.cookies.get('vape_role')?.value

  // ----- Admin route protection -----
  // All /admin/* paths except /admin/login require admin access
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (roleCookie === 'admin') {
      return NextResponse.next()
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
  }

  if (pathname.startsWith('/pos')) {
    if (roleCookie === 'pos' || roleCookie === 'admin') {
      return NextResponse.next()
    }

    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ----- Age gate -----
  // /admin/login, /login and /verificar-edad are always public
  const isPublicPath =
    pathname === AGE_GATE_PATH ||
    pathname.startsWith('/admin/login') ||
    pathname === '/login'

  const ageVerified =
    request.cookies.get('age_verified')?.value === 'true' ||
    (request.headers.get('cookie') ?? '').includes('age_verified=true')

  if (!isPublicPath && !ageVerified) {
    return NextResponse.redirect(new URL(AGE_GATE_PATH, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
