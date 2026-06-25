'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function VerificarEdadPage() {
  const router = useRouter()
  const [aceptado, setAceptado] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleVerificar() {
    if (!aceptado) {
      setError('Debes confirmar que eres mayor de 18 años.')
      return
    }

    setLoading(true)

    // Guarda el registro en Supabase
    const supabase = createClient()
    await supabase.from('age_verifications').insert({
      session_id: crypto.randomUUID(),
      ip_address: null,
    })

    // Setea la cookie por 24 horas
    document.cookie = `age_verified=true; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`

    router.push('/tienda')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center">

        <div className="text-5xl mb-4">🔞</div>

        <h1 className="text-white text-2xl font-bold mb-2">
          Verificación de edad
        </h1>

        <p className="text-zinc-400 text-sm mb-6">
          Este sitio vende productos de vapeo. El acceso está
          restringido a mayores de 18 años.
        </p>

        <label className="flex items-start gap-3 text-left cursor-pointer mb-6">
          <input
            type="checkbox"
            checked={aceptado}
            onChange={(e) => {
              setAceptado(e.target.checked)
              setError('')
            }}
            className="mt-1 accent-white w-4 h-4 flex-shrink-0"
          />
          <span className="text-zinc-300 text-sm">
            Confirmo que tengo 18 años o más y acepto los{' '}
            <a href="/terminos" className="underline text-white">
              términos y condiciones
            </a>
            .
          </span>
        </label>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={handleVerificar}
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-zinc-200 transition disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Tengo 18 años o más — Entrar'}
        </button>

        <p className="text-zinc-600 text-xs mt-6">
          Al ingresar confirmas tu mayoría de edad bajo la legislación colombiana.
        </p>

      </div>
    </main>
  )
}