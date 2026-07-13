import { Filtros } from '@/components/tienda/Filtros'
import { ProductCard, type Product } from '@/components/tienda/ProductCard'
import { createClient } from '@/lib/supabase/server'

interface SearchParams {
  marca?: string
  sabor?: string
  tipo?: string
  buscar?: string
}

export default async function TiendaPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const marca = params?.marca ?? ''
  const sabor = params?.sabor ?? ''
  const tipo = params?.tipo ?? ''
  const buscar = params?.buscar ?? ''

  const supabase = await createClient()

  if (!supabase) {
    return (
      <main className="min-h-screen bg-[#05070F] px-6 py-16 text-slate-100">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-800 bg-[#081025]/90 p-10 text-center shadow-[0_0_60px_rgba(59,130,246,0.08)]">
          <h1 className="text-3xl font-semibold text-white">Configura Supabase para ver el catálogo</h1>
          <p className="mt-3 text-slate-400">Completa las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local.</p>
        </div>
      </main>
    )
  }

  let query = supabase.from('products').select('*').order('name', { ascending: true })

  if (marca) {
    query = query.eq('brand', marca)
  }

  if (sabor) {
    query = query.eq('flavor', sabor)
  }

  if (tipo) {
    query = query.eq('type', tipo)
  }

  if (buscar) {
    query = query.ilike('name', `%${buscar}%`)
  }

  const { data: products, error } = await query
  const productos = (products ?? []) as Product[]

  const marcas = Array.from(new Set(productos.map((product) => product.brand).filter(Boolean))).sort()
  const sabores = Array.from(new Set(productos.map((product) => product.flavor).filter(Boolean))).sort()
  const tipos = Array.from(new Set(productos.map((product) => product.type).filter(Boolean))).sort()

  return (
    <main className="min-h-screen bg-[#05070F] px-6 py-16 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-[2rem] border border-cyan-500/10 bg-[#08102A]/90 p-6 shadow-[0_0_80px_rgba(14,165,233,0.10)] lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Catálogo Cyber-Neon</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Explora el mejor vapeo futurista</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Filtra por marca, sabor o tipo y descubre productos con estilo neon rojo/azul.</p>
          </div>

          <form action="/tienda" method="get" className="flex w-full max-w-xl gap-3">
            <input
              type="search"
              name="buscar"
              defaultValue={buscar}
              placeholder="Buscar por nombre"
              className="flex-1 rounded-2xl border border-slate-800 bg-[#02060F] px-4 py-3 text-sm text-slate-100 outline-none ring-0 transition duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
            <button type="submit" className="rounded-2xl bg-gradient-to-r from-blue-600 to-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110">
              Buscar
            </button>
          </form>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Filtros marcas={marcas} sabores={sabores} tipos={tipos} />

          <section className="space-y-4">
            {error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.12)]">
                No se pudieron cargar los productos. Intenta de nuevo.
              </div>
            ) : null}

            {productos.length === 0 ? (
              <div className="rounded-[2rem] border border-slate-800 bg-[#081025]/80 p-10 text-center text-slate-400 shadow-[0_0_30px_rgba(59,130,246,0.08)]">
                No encontramos productos con esos filtros.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {productos.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
