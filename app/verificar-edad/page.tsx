'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function VerificarEdadPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [supabaseStatus, setSupabaseStatus] = useState('')

  useEffect(() => {
    if (document.cookie.includes('age_verified=true')) {
      router.replace('/tienda')
    }
  }, [router])

  const handleVerify = async (isAdult: boolean) => {
    setIsLoading(true)
    document.cookie = `age_verified=${isAdult ? 'true' : 'false'}; path=/; max-age=31536000`

    if (!isAdult) {
      setMessage('Lo sentimos, este contenido es exclusivo para mayores de 18 años.')
      setSupabaseStatus('')
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    if (supabase) {
      try {
        const sessionId = typeof crypto !== 'undefined' ? crypto.randomUUID() : `guest-${Date.now()}`
        const { error } = await supabase.from('age_verifications').insert({ session_id: sessionId })
        if (error) throw error
        setSupabaseStatus('Conexión a Supabase lista.')
      } catch (error) {
        console.error('No se pudo registrar la verificación', error)
        setSupabaseStatus('La verificación se guardó localmente, pero Supabase no aceptó el registro.')
      }
    } else {
      setSupabaseStatus('Supabase no está configurado con una URL válida y una anon key válida.')
    }

    router.replace('/tienda')
  }

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-zinc-100">
      <div className="mx-auto flex max-w-2xl flex-col gap-6 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 shadow-2xl shadow-black/40">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">Acceso restringido</p>
          <h1 className="text-3xl font-semibold">Debes confirmar que eres mayor de 18 años</h1>
          <p className="text-base text-zinc-400">
            Este marketplace está dirigido a adultos. Confirma tu edad para continuar.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => handleVerify(true)}
            disabled={isLoading}
            className="rounded-2xl bg-emerald-500 px-5 py-3 font-medium text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? 'Verificando...' : 'Sí, soy mayor de 18 años'}
          </button>
          <button
            onClick={() => handleVerify(false)}
            disabled={isLoading}
            className="rounded-2xl border border-zinc-700 px-5 py-3 font-medium text-zinc-200 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            No, no lo soy
          </button>
        </div>

        {message ? <p className="text-sm text-zinc-300">{message}</p> : null}
        {supabaseStatus ? <p className="text-sm text-zinc-400">{supabaseStatus}</p> : null}
      </div>
    </main>
  )
}
