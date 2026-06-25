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
      <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
        <div className="mx-auto max-w-6xl rounded-3xl border border-zinc-800 bg-zinc-900/80 p-10 text-center">
          <h1 className="text-3xl font-semibold">Configura Supabase para ver el catálogo</h1>
          <p className="mt-3 text-zinc-400">Completa las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local.</p>
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
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-lg shadow-black/20 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">Catálogo</p>
            <h1 className="mt-2 text-3xl font-semibold">Explora el mejor vapeo</h1>
            <p className="mt-2 max-w-2xl text-zinc-400">Filtra por marca, sabor o tipo y encuentra tu favorito.</p>
          </div>

          <form action="/tienda" method="get" className="flex w-full max-w-xl gap-3">
            <input
              type="search"
              name="buscar"
              defaultValue={buscar}
              placeholder="Buscar por nombre"
              className="flex-1 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none ring-0"
            />
            <button type="submit" className="rounded-2xl bg-emerald-500 px-4 py-3 font-medium text-black transition hover:bg-emerald-400">
              Buscar
            </button>
          </form>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Filtros marcas={marcas} sabores={sabores} tipos={tipos} />

          <section className="space-y-4">
            {error ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
                No se pudieron cargar los productos: {error.message}
              </div>
            ) : null}

            {productos.length === 0 ? (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-10 text-center text-zinc-400">
                No encontramos productos con esos filtros.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
