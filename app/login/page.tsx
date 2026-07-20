'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { logAuthEvent } from './actions'

function getSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    // ── RATE LIMITING: verificar antes de llamar a Supabase
    try {
      const rateLimitCheck = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rateLimitCheck: true }),
      })
      if (rateLimitCheck.status === 429) {
        const data = await rateLimitCheck.json()
        setError(data.error ?? 'Demasiados intentos. Espera 15 minutos antes de intentar de nuevo.')
        setLoading(false)
        return
      }
    } catch {
      // Si falla la verificación continuar normalmente
    }

    const supabase = getSupabaseClient()

    // 1. Login normal contra Supabase Auth
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    if (signInError || !data.user) {
      void logAuthEvent(email, false, 'Invalid credentials')
      setError('Usuario o contraseña incorrectos.')
      setLoading(false)
      return
    }

    // 2. Ya logueado, consultamos su rol directo en la tabla profiles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()
    if (profileError || !profile) {
      void logAuthEvent(email, false, 'No role assigned in profiles table')
      setError('Tu cuenta no tiene un rol asignado. Contacta al administrador.')
      setLoading(false)
      return
    }
    if (profile.role === 'admin') {
      void logAuthEvent(email, true)
      router.replace('/admin')
      return
    } else if (profile.role === 'pos') {
      void logAuthEvent(email, true)
      router.replace('/pos')
      return
    } else {
      void logAuthEvent(email, false, `Role ${profile.role} is not allowed to login here`)
      setError('Tu cuenta no tiene un rol asignado válido. Contacta al administrador.')
      setLoading(false)
      return
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-[#E2E8F0] bg-white shadow-xl shadow-[rgba(37,99,235,0.08)]">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] px-8 py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur">
              🔐
            </div>

            <h1 className="text-3xl font-bold text-white">
              Inicio de sesión
            </h1>

            <p className="mt-2 text-sm text-white/90">
              Ingresa tus credenciales para acceder a admin o POS.
            </p>
          </div>

          {/* Formulario */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold text-[#0F172A]"
                >
                  Correo
                </label>

                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="username"
                  placeholder="tu@correo.com"
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] outline-none transition duration-200 placeholder:text-[#475569]/60 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(147,51,234,0.12)]"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-sm font-semibold text-[#0F172A]"
                >
                  Contraseña
                </label>

                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-[#0F172A] outline-none transition duration-200 placeholder:text-[#475569]/60 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(147,51,234,0.12)]"
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-[#DC2626]/20 bg-[#DC2626]/5 p-4 text-sm text-[#DC2626]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-[length:200%_100%] bg-[position:0%_0%] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(147,51,234,0.08)] transition-all duration-300 hover:scale-[1.02] hover:bg-[position:100%_0%] hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}