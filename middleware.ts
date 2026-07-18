import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const AGE_GATE_PATH = '/verificar-edad'

function normalizeSupabaseUrl(url: string | undefined): string {
  if (!url) return ''
  return url.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/i, '')
}

// Envía un log al API Route en Node.js desde el Edge Runtime (fire-and-forget)
function sendLog(
  request: NextRequest,
  level: 'info' | 'warn' | 'error',
  domain: 'auth' | 'admin' | 'orders' | 'db' | 'system',
  action: string,
  message: string,
  extra?: { user?: string; ip?: string; metadata?: Record<string, unknown> }
) {
  const origin = request.nextUrl.origin
  void fetch(`${origin}/api/logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, domain, action, message, ...extra }),
  }).catch(() => { /* No afectar la experiencia del usuario */ })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for') || ''

  // No procesar assets estáticos ni el endpoint de logs
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  const supabaseUrl = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  // Age gate: se evalúa primero, es liviano y no requiere red
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

  // response mutable: necesario para que Supabase pueda refrescar el JWT/cookies
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

  // getUser() valida el JWT contra Supabase — nunca getSession()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    sendLog(request, 'warn', 'auth', 'access_denied',
      `Intento de acceso sin autenticación a ${pathname}`, { ip })
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // El rol sale de la tabla profiles, no del JWT
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role ?? 'customer'

  if (pathname.startsWith('/admin') && role !== 'admin') {
    sendLog(request, 'warn', 'auth', 'unauthorized_admin_access',
      `Acceso no autorizado al panel admin: ${pathname}`,
      { user: user.id, ip, metadata: { role } })
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname.startsWith('/pos') && role !== 'admin' && role !== 'pos') {
    sendLog(request, 'warn', 'auth', 'unauthorized_pos_access',
      `Acceso no autorizado al POS: ${pathname}`,
      { user: user.id, ip, metadata: { role } })
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/admin') {
    sendLog(request, 'info', 'admin', 'admin_panel_access',
      'Acceso exitoso al panel administrativo', { user: user.id, ip })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

