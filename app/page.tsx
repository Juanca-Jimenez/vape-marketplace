import Link from 'next/link'

const categorias = [
  {
    label: 'Vapes Desechables',
    emoji: '☁️',
    href: '/tienda?tipo=Desechable',
    desc: 'Prácticos, potentes y listos para disfrutar desde el primer uso.'
  },
  {
    label: 'Pods Recargables',
    emoji: '⚡',
    href: '/tienda?tipo=Pod%20recargable',
    desc: 'Diseñados para quienes buscan más control y duración.'
  }
]

const features = [
  { icon: '🚚', title: 'Envíos a todo el país', desc: 'Cobertura nacional con tiempos claros desde el primer día.' },
  { icon: '✅', title: '100% originales', desc: 'Trabajamos directo con marcas reconocidas, sin réplicas.' },
  { icon: '💳', title: 'Pago como prefieras', desc: 'Nequi, Daviplata, Lulo o efectivo contra entrega.' },
  { icon: '💬', title: 'Soporte real por WhatsApp', desc: 'Un asesor, no un bot, resolviendo tus dudas.' },
]

const sabores = ['Mango Ice', 'Blue Razz', 'Watermelon', 'Mint Fusion', 'Grape Storm', 'Peach Splash', 'Cola Rush', 'Strawberry Kiwi']

export default function Home() {
  return (
    <main className="bg-white text-[#0F172A]">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[#0B1120] px-6 pb-24 pt-10">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] opacity-25 blur-[130px]" />

        {/* Nav */}
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between">
          <span className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-lg font-bold text-transparent">
            VAPE MARKETPLACE
          </span>

          <Link
            href="/tienda"
            className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Ir a la tienda
          </Link>
        </nav>

        {/* Hero content */}
        <div className="relative mx-auto mt-20 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300">
            Nueva cultura del vapeo
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] text-white sm:text-6xl">
            Tu vibra,
            <span className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-transparent"> tu sabor</span>,
            tu ritmo.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">
            Marcas originales, sabores que se sienten en la calle y entrega directa a tu
            puerta. Sin vueltas, sin réplicas, sin esperar.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/tienda"
              className="w-full rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-[length:200%_100%] bg-[position:0%_0%] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(147,51,234,0.3)] transition-all duration-300 hover:scale-[1.03] hover:bg-[position:100%_0%] active:scale-[0.98] sm:w-auto"
            >
              Explorar catálogo
            </Link>
            <a
              href="https://wa.me/573137175806"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-2xl border border-white/15 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/5 sm:w-auto"
            >
              Habla con un asesor
            </a>
          </div>
        </div>

        {/* Marquee de sabores */}
        <div className="relative mt-20 overflow-hidden border-y border-white/10 py-4">
          <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-10 motion-reduce:animate-none">
            {[...sabores, ...sabores].map((flavor, index) => (
              <span key={index} className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
                {flavor}
                <span className="text-[#9333EA]">•</span>
              </span>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ===== CATEGORÍAS ===== */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-sm font-semibold uppercase tracking-[0.35em] text-transparent">
            Catálogo
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[#0F172A] sm:text-4xl">
            Elige tu estilo
          </h2>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-8">
          {categorias.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"
            >
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-3xl shadow-lg">
                  {cat.emoji}
                </div>

                <h3 className="mb-2 text-xl font-bold text-slate-900">
                  {cat.label}
                </h3>

                <p className="mb-6 leading-relaxed text-slate-600">
                  {cat.desc}
                </p>

                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all group-hover:gap-3">
                  Explorar categoría
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="nosotros" className="bg-[#F8FAFC] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            {/* Contenido */}
            <div>
              <p className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-sm font-semibold uppercase tracking-[0.35em] text-transparent">
                Nuestra diferencia
              </p>

              <h2 className="mt-4 text-3xl font-semibold leading-tight text-[#0F172A] sm:text-4xl">
                Una experiencia diseñada para comprar con confianza
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-[#475569]">
                Seleccionamos cuidadosamente cada producto, trabajamos con
                distribuidores verificados y mantenemos un proceso de compra simple,
                seguro y transparente desde el primer clic hasta la entrega.
              </p>
            </div>

            {/* Tarjetas */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Fondo degradado suave */}
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${index % 4 === 0
                      ? 'bg-gradient-to-br from-blue-50 via-transparent to-transparent'
                      : index % 4 === 1
                        ? 'bg-gradient-to-br from-purple-50 via-transparent to-transparent'
                        : index % 4 === 2
                          ? 'bg-gradient-to-br from-red-50 via-transparent to-transparent'
                          : 'bg-gradient-to-br from-slate-100 via-transparent to-transparent'
                      }`}
                  />

                  <div className="relative z-10">
                    <div className="mb-5 h-[2px] w-14 rounded-full bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626]" />

                    <h3 className="text-lg font-semibold tracking-tight text-[#0F172A]">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#475569]">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== BANNER LIFESTYLE ===== */}
      <section className="px-6 py-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#0B1120] px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] opacity-20 blur-[110px]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-2xl font-semibold leading-tight text-white sm:text-3xl">
              No vendemos solo dispositivos. Vendemos la actitud de quien sabe lo que quiere.
            </h2>
            <Link
              href="/tienda"
              className="mt-8 inline-flex rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-[length:200%_100%] bg-[position:0%_0%] px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(147,51,234,0.3)] transition-all duration-300 hover:scale-[1.03] hover:bg-[position:100%_0%] active:scale-[0.98]"
            >
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10">

          {/* Marca + navegación + contacto */}
          <div className="grid gap-10 lg:grid-cols-4">

            {/* Marca */}
            <div className="lg:col-span-2">

              <img
                src="/logo.png"
                alt="The V Society"
                className="h-28 w-auto max-w-[220px] object-contain"
              />

              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#475569]">
                Marketplace especializado en productos de vapeo originales.
                Distribución nacional, venta al por mayor y al detal con atención
                personalizada y envíos a toda Colombia.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#475569]">
                  Envíos Nacionales
                </span>

                <span className="rounded-full bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#475569]">
                  Productos Originales
                </span>

                <span className="rounded-full bg-[#F8FAFC] px-3 py-2 text-xs font-medium text-[#475569]">
                  Pago Seguro
                </span>
              </div>

            </div>


            {/* Navegación */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                Tienda
              </h3>

              <ul className="mt-4 space-y-3 text-sm text-[#475569]">

                <li>
                  <Link
                    href="/tienda"
                    className="transition hover:text-[#9333EA]"
                  >
                    Catálogo
                  </Link>
                </li>

                <li>
                  <Link
                    href="/carrito"
                    className="transition hover:text-[#9333EA]"
                  >
                    Carrito
                  </Link>
                </li>

                <li>
                  <Link
                    href="/tienda?tipo=Desechable"
                    className="transition hover:text-[#9333EA]"
                  >
                    Desechables
                  </Link>
                </li>

                <li>
                  <Link
                    href="/tienda?tipo=Pod%20recargable"
                    className="transition hover:text-[#9333EA]"
                  >
                    Pods Recargables
                  </Link>
                </li>

              </ul>
            </div>


            {/* Contacto */}
            <div>

              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">
                Contacto
              </h3>


              <div className="mt-4 space-y-3 text-sm text-[#475569]">

                <p>📱 +57 313 717 5806</p>

                <p>
                  ✉️ contacto@thevsociety.com
                </p>

                <p>
                  🕘 Lun - Sáb: 9:00 a.m. – 8:00 p.m.
                </p>

                <p>
                  🇨🇴 Colombia
                </p>


                <a
                  href="https://wa.me/573137175806"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] px-5 py-2 text-xs font-semibold text-white transition hover:scale-105"
                >
                  WhatsApp
                </a>

              </div>

            </div>

          </div>



          {/* Aviso legal */}
          <div className="mt-10 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-4">

            <p className="text-sm leading-relaxed text-yellow-800">
              ⚠️ <strong>Venta exclusiva para mayores de 18 años.</strong>
              Este producto contiene nicotina, una sustancia química adictiva.
            </p>

          </div>



          {/* Beneficios */}
          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#E2E8F0] pt-8 md:grid-cols-4">


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

            <p>
              Venta responsable • +18
            </p>

          </div>


        </div>
      </footer>
    </main>
  )
}