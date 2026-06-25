'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function VerificarEdadPage() {
  const router = useRouter()
  const [birthDate, setBirthDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (document.cookie.includes('age_verified=true')) {
      router.replace('/tienda')
    }
  }, [router])

  /**
   * Calcula si el usuario es mayor de 18 años.
   * Evita errores de años bisiestos y zona horaria.
   */
  const isAdult = (dateStr: string): boolean => {
    const today = new Date()
    const birth = new Date(dateStr)

    // Validación básica
    if (isNaN(birth.getTime())) return false

    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    // Si el cumpleaños aún no ha ocurrido este año, restar 1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }

    return age >= 18
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Validar que ingresó una fecha
    if (!birthDate) {
      setError('Por favor, ingresa tu fecha de nacimiento.')
      setIsLoading(false)
      return
    }

    // Validar edad
    if (!isAdult(birthDate)) {
      setError('Lo sentimos, este es un sitio web exclusivo para mayores de edad. No tienes permitido el ingreso.')
      setIsLoading(false)
      return
    }

    // Guardar cookie por 30 días
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)
    document.cookie = `age_verified=true; path=/; expires=${expiryDate.toUTCString()}; SameSite=Strict`

    // Registrar en Supabase
    const supabase = createClient()
    try {
      const sessionId = typeof crypto !== 'undefined' ? crypto.randomUUID() : `guest-${Date.now()}`
      await supabase.from('age_verifications').insert({
        session_id: sessionId,
        birth_date: birthDate,
      })
    } catch (err) {
      console.error('Error al registrar en Supabase:', err)
      // Continuar aunque Supabase falle
    }

    setSuccess(true)
    setTimeout(() => router.replace('/tienda'), 500)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
          {/* Encabezado */}
          <div className="mb-8 text-center">
            <div className="mb-4 text-5xl">🔞</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Verificación de Edad
            </h1>
            <p className="text-sm text-zinc-400">
              Debes ser mayor de 18 años para acceder a este sitio.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-zinc-300 mb-2">
                Fecha de Nacimiento
              </label>
              <input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => {
                  setBirthDate(e.target.value)
                  setError(null) // Limpiar error al cambiar fecha
                }}
                disabled={isLoading || success}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-600 bg-red-900/30 p-4">
                <p className="text-sm text-red-300 font-medium">{error}</p>
              </div>
            )}

            {/* Botón envío */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full rounded-lg bg-white text-black font-semibold py-3 transition hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verificando...' : success ? '✓ Redirigiendo...' : 'Verificar Edad'}
            </button>
          </form>

          {/* Aviso legal */}
          <p className="mt-6 text-center text-xs text-zinc-600">
            Al continuar confirmas tu mayoría de edad bajo la legislación local.
          </p>
        </div>
      </div>
    </main>
  )
}
