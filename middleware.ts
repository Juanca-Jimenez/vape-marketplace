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

  // ----- Admin route protection -----
  // All /admin/* paths except /admin/login require a valid session
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!supabaseUrl || !supabaseAnonKey) {
      // Supabase not configured — let the layout handle it
      return NextResponse.next()
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Authenticated admin — skip age gate for admin paths
    return NextResponse.next()
  }

  // ----- Age gate -----
  // /admin/login and /verificar-edad are always public
  const isPublicPath =
    pathname === AGE_GATE_PATH ||
    pathname.startsWith('/admin/login')

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
