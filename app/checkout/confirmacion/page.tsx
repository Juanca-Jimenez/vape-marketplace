'use client'

import { useRouter } from 'next/navigation'

export default function CheckoutConfirmationPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-10 text-center shadow-lg shadow-black/20">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Pedido enviado</p>
        <h1 className="mt-4 text-3xl font-semibold text-white">Tu pedido fue enviado. Pronto nos comunicaremos contigo.</h1>
        <button
          type="button"
          onClick={() => router.push('/tienda')}
          className="mt-8 rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400"
        >
          Volver a la tienda
        </button>
      </div>
    </main>
  )
}
