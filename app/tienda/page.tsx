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
      <>
        <main className="min-h-screen bg-white px-6 py-16 text-[#0F172A]">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-[#E2E8F0] bg-white p-10 text-center shadow-xl shadow-[rgba(37,99,235,0.08)]">
            <h1 className="text-3xl font-semibold text-[#0F172A]">Configura Supabase para ver el catálogo</h1>
            <p className="mt-3 text-[#475569]">Completa las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en tu archivo .env.local.</p>
          </div>
        </main>

        <footer className="border-t border-[#E2E8F0] bg-white">
          <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-center text-xs font-medium text-[#0F172A] sm:text-sm">
            ⚠️ Venta exclusiva para mayores de 18 años. Este producto contiene nicotina, una sustancia química adictiva.
          </div>
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-lg font-bold text-transparent">
                  The V Society
                </p>
                <p className="mt-2 text-sm text-[#475569]">
                  Distribución nacional y local, venta al por mayor y al detal.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#0F172A]">Contacto</h3>
                <p className="mt-2 text-sm text-[#475569]">+57 313 717 5806</p>
                <p className="text-sm text-[#475569]">Lun - Sáb: 9:00 a.m. – 8:00 p.m.</p>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#0F172A]">Servicio</h3>
                <p className="mt-2 text-sm text-[#475569]">Distribución nacional</p>
                <p className="text-sm text-[#475569]">Venta al por mayor y al detal</p>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#0F172A]">Legal</h3>
                <p className="mt-2 text-sm text-[#475569]">
                  Venta exclusiva para mayores de 18 años. Nos reservamos el derecho de solicitar
                  verificación de edad antes de confirmar cualquier pedido.
                </p>
              </div>
            </div>
            <div className="mt-8 border-t border-[#E2E8F0] pt-6 text-center text-xs text-[#475569]">
              © {new Date().getFullYear()} The V Society. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </>
    )
  }

  let query = supabase.from('products').select('*').eq('is_active', true).order('name', { ascending: true })

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
    <>
      <main className="min-h-screen bg-white px-6 py-16 text-[#0F172A]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8">
          <div className="flex flex-col gap-4 rounded-[2rem] border border-[#E2E8F0] bg-white p-6 shadow-xl shadow-[rgba(37,99,235,0.08)] lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-sm font-semibold uppercase tracking-[0.35em] text-transparent">
                Catálogo
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#0F172A]">Explora el mejor vapeo</h1>
              <p className="mt-2 max-w-2xl text-[#475569]">Filtra por marca, sabor o tipo y descubre productos.</p>
            </div>

            <form action="/tienda" method="get" className="flex w-full max-w-xl gap-3">
              <input
                type="search"
                name="buscar"
                defaultValue={buscar}
                placeholder="Buscar por nombre"
                className="flex-1 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none ring-0 transition duration-200 placeholder:text-[#475569]/60 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(147,51,234,0.12)]"
              />
              <button
                type="submit"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-[length:200%_100%] bg-[position:0%_0%] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(147,51,234,0.08)] transition-all duration-300 hover:scale-[1.03] hover:bg-[position:100%_0%] hover:shadow-xl active:scale-[0.98]"
              >
                Buscar
              </button>
            </form>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <Filtros marcas={marcas} sabores={sabores} tipos={tipos} />

            <section className="space-y-4">
              {error ? (
                <div className="rounded-2xl border border-[#DC2626]/20 bg-[#DC2626]/5 p-4 text-[#DC2626] shadow-lg shadow-[rgba(220,38,38,0.06)]">
                  No se pudieron cargar los productos. Intenta de nuevo.
                </div>
              ) : null}

              {productos.length === 0 ? (
                <div className="rounded-[2rem] border border-[#E2E8F0] bg-white p-10 text-center text-[#475569] shadow-lg shadow-[rgba(37,99,235,0.06)]">
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

      <footer className="border-t border-[#E2E8F0] bg-white">
        {/* Aviso legal superior */}
        <div className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="mx-auto max-w-7xl px-4 py-3 text-center">
            <p className="text-xs font-medium text-[#0F172A] sm:text-sm">
              ⚠️ Venta exclusiva para mayores de 18 años. Este producto contiene
              nicotina, una sustancia química altamente adictiva.
            </p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-b border-[#E2E8F0]">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F8FAFC] p-8 shadow-sm">
              <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
                <div>
                  <h3 className="text-2xl font-bold text-[#0F172A]">
                    Recibe ofertas y nuevos lanzamientos
                  </h3>
                  <p className="mt-2 text-sm text-[#475569]">
                    Suscríbete para obtener promociones exclusivas y novedades.
                  </p>
                </div>

                <form className="flex w-full max-w-md gap-2">
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    className="flex-1 rounded-2xl border border-[#E2E8F0] px-4 py-3 text-sm outline-none focus:border-transparent focus:shadow-[0_0_0_3px_rgba(147,51,234,0.15)]"
                  />
                  <button
                    type="submit"
                    className="rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] px-5 py-3 text-sm font-semibold text-white transition hover:scale-105"
                  >
                    Suscribirme
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer principal */}
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">

            {/* Marca */}
            <div className="lg:col-span-2">
              <h2 className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-3xl font-bold text-transparent">
                The V Society
              </h2>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#475569]">
                Marketplace especializado en productos de vapeo originales.
                Distribución nacional, venta al por mayor y al detal con atención
                personalizada y envíos a toda Colombia.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#475569]">
                  🚚 Envíos Nacionales
                </span>

                <span className="rounded-full bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#475569]">
                  ✅ Productos Originales
                </span>

                <span className="rounded-full bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#475569]">
                  💳 Pago Seguro
                </span>
              </div>
            </div>

            {/* Navegación */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                Tienda
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-[#475569]">
                <li><a href="/tienda">Catálogo</a></li>
                <li><a href="/carrito">Carrito</a></li>
                <li><a href="/tienda?tipo=Desechable">Desechables</a></li>
                <li><a href="/tienda?tipo=Pod%20recargable">Pods</a></li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                Contacto
              </h3>

              <div className="mt-4 space-y-3 text-sm text-[#475569]">
                <p>📞 +57 313 717 5806</p>
                <p>📧 contacto@thevsociety.com</p>
                <p>🕐 Lun - Sáb: 9:00 a.m. – 8:00 p.m.</p>
                <p>📍 Colombia</p>

                <a
                  href="https://wa.me/573137175806"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] px-4 py-2 text-xs font-semibold text-white transition hover:scale-105"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[#E2E8F0] pt-8 md:grid-cols-4">
            <div>
              <p className="font-semibold text-[#0F172A]">
                🚚 Envíos rápidos
              </p>
              <p className="text-sm text-[#475569]">
                Cobertura nacional
              </p>
            </div>

            <div>
              <p className="font-semibold text-[#0F172A]">
                🔒 Compra segura
              </p>
              <p className="text-sm text-[#475569]">
                Protección de datos
              </p>
            </div>

            <div>
              <p className="font-semibold text-[#0F172A]">
                💬 Soporte
              </p>
              <p className="text-sm text-[#475569]">
                Atención personalizada
              </p>
            </div>

            <div>
              <p className="font-semibold text-[#0F172A]">
                ⭐ Calidad garantizada
              </p>
              <p className="text-sm text-[#475569]">
                Productos originales
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#E2E8F0] pt-6 text-xs text-[#64748B] md:flex-row">
            <p>
              © {new Date().getFullYear()} The V Society. Todos los derechos reservados.
            </p>


          </div>
        </div>
      </footer>
    </>
  )
}