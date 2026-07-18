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

  // ----- Age gate (se evalúa primero, es liviano y no requiere red) -----
  const isPublicPath =
    pathname === AGE_GATE_PATH ||
    pathname.startsWith('/admin/login') ||
    pathname === '/login'

  const ageVerified = request.cookies.get('age_verified')?.value === 'true'

  if (!isPublicPath && !ageVerified) {
    return NextResponse.redirect(new URL(AGE_GATE_PATH, request.url))
  }

  // Rutas que no necesitan validar rol: seguimos de largo
  const needsRoleCheck = pathname.startsWith('/admin') || pathname.startsWith('/pos')
  if (!needsRoleCheck) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // response mutable: necesario para que Supabase pueda refrescar
  // el JWT/cookies de sesión si están por expirar
  let response = NextResponse.next()

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  // getUser() SIEMPRE, nunca getSession(): valida el JWT contra el
  // servidor de Supabase en vez de solo leer la cookie sin verificar.
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // El rol sale de la tabla profiles, no del JWT (no usamos Auth Hook).
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'customer'

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/pos') && role !== 'admin' && role !== 'pos') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
