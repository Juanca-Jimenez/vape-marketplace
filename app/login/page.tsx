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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-12 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-12 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-32 bottom-12 h-80 w-80 rounded-full bg-rose-500/10 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-zinc-800 bg-[#030712]/95 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
              <span className="text-2xl">🔐</span>
            </div>
            <h1 className="mt-6 text-2xl font-semibold text-white">Inicio de sesión (USUARIOS EN SUPABASE)</h1>
            <p className="mt-2 text-sm text-slate-400">Ingresa tus credenciales para acceder a admin o POS.</p>
            <p className="mt-1 text font-semibold text-white">ESTO SE ELIMINARÁ EN LA ENTREGA, PERO CREDENCIALES SON:</p>
            <h3 className="mt-2 text-sm text-slate-100">admin: admin1@gmail.com / admin</h3>
            <h3 className="mt-2 text-sm text-slate-100">pos: user3@gmail.com / user</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-300">
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
                className="w-full rounded-2xl border border-slate-800 bg-[#02060F] px-4 py-3 text-white outline-none ring-0 transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-300">
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
                className="w-full rounded-2xl border border-slate-800 bg-[#02060F] px-4 py-3 text-white outline-none ring-0 transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}