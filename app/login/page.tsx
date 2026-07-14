'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const credentials: Record<string, { password: string; role: 'admin' | 'pos' }> = {
  bodega: { password: 'bodega2026', role: 'pos' },
  santiago: { password: 'Santi0803', role: 'admin' },
}

function getSavedRole() {
  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('vape_role='))
    ?.split('=')[1] as 'admin' | 'pos' | undefined
}

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const role = getSavedRole()
    if (role === 'admin') {
      router.replace('/admin')
    } else if (role === 'pos') {
      router.replace('/pos')
    }
  }, [router])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    const user = credentials[username.trim().toLowerCase()]
    if (!user || password !== user.password) {
      setError('Usuario o contraseña incorrectos.')
      setLoading(false)
      return
    }

    document.cookie = `vape_role=${user.role}; path=/; max-age=${60 * 60 * 24}`
    window.location.assign(user.role === 'admin' ? '/admin' : '/pos')
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
            <h1 className="mt-6 text-2xl font-semibold text-white">Inicio de sesión</h1>
            <p className="mt-2 text-sm text-slate-400">Ingresa tus credenciales para acceder a admin o POS.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-username" className="mb-2 block text-sm font-medium text-slate-300">
                Usuario
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                placeholder="bodega o santiago"
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

          <p className="mt-6 text-center text-xs text-slate-500">
            Usa <strong>bodega</strong> / <strong>bodega2026</strong> para POS, o <strong>santiago</strong> / <strong>Santi0803</strong> para admin.
          </p>
        </div>
      </div>
    </main>
  )
}
