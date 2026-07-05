'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function VerificarEdadPage() {
  const router = useRouter()
  const [birthDate, setBirthDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const hasAgeCookie = document.cookie.split(';').some((c) => c.trim().startsWith('age_verified=true'))
    if (hasAgeCookie) {
      router.replace('/tienda')
    }
  }, [router])

  const isAdult = (dateStr: string): boolean => {
    const birth = new Date(dateStr)
    if (isNaN(birth.getTime())) return false
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age >= 18
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!birthDate) {
      setError('Por favor, ingresa tu fecha de nacimiento.')
      return
    }

    if (!isAdult(birthDate)) {
      setError('Lo sentimos, debes ser mayor de 18 años para acceder.')
      return
    }

    setIsLoading(true)

    // Set cookie first — this is what the middleware checks
    document.cookie = 'age_verified=true; path=/; max-age=2592000; SameSite=Lax'
    localStorage.setItem('age_verified', 'true')

    // Fire-and-forget Supabase insert (don't block redirect on this)
    try {
      const supabase = createClient()
      if (supabase) {
        void supabase.from('age_verifications').insert({
          session_id: crypto.randomUUID(),
          birth_date: birthDate,
        })
      }
    } catch {
      // non-blocking
    }

    // Redirect immediately after setting cookie
    window.location.assign('/tienda')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mb-4 text-5xl">🔞</div>
            <h1 className="mb-2 text-2xl font-bold text-white">Verificación de Edad</h1>
            <p className="text-sm text-zinc-400">Debes ser mayor de 18 años para acceder a este sitio.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="birthDate" className="mb-2 block text-sm font-medium text-zinc-300">
                Fecha de Nacimiento
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => { setBirthDate(e.target.value); setError(null) }}
                disabled={isLoading}
                max={new Date().toISOString().split('T')[0]}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-600 bg-red-900/30 p-4">
                <p className="text-sm font-medium text-red-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Redirigiendo...' : 'Verificar Edad'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-zinc-600">
            Al continuar confirmas tu mayoría de edad bajo la legislación local.
          </p>
        </div>
      </div>
    </main>
  )
}
