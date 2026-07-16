import Link from 'next/link'

const categorias = [
  { label: 'Desechables', emoji: '💨', href: '/tienda?tipo=Desechable', desc: 'Listos para usar, cero configuración.' },
  { label: 'Pods recargables', emoji: '🔋', href: '/tienda?tipo=Pod%20recargable', desc: 'Para quienes ya tienen su ritmo.' },
  { label: 'Líquidos', emoji: '🧪', href: '/tienda?tipo=Liquido', desc: 'Sabores originales, sin imitaciones.' },
  { label: 'Accesorios', emoji: '⚙️', href: '/?tipo=Accesorio', desc: 'Todo lo que necesitas para tu equipo.' },
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

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categorias.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group flex flex-col gap-3 rounded-[1.75rem] border border-[#E2E8F0] bg-white p-6 shadow-lg shadow-[rgba(37,99,235,0.05)] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(147,51,234,0.1)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8FAFC] text-2xl">
                {cat.emoji}
              </span>
              <p className="text-base font-semibold text-[#0F172A]">{cat.label}</p>
              <p className="text-sm text-[#475569]">{cat.desc}</p>
              <span className="mt-1 text-sm font-medium text-[#9333EA] opacity-0 transition group-hover:opacity-100">
                Ver productos →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="nosotros" className="bg-[#F8FAFC] px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] bg-clip-text text-sm font-semibold uppercase tracking-[0.35em] text-transparent">
                Por qué The V Society
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#0F172A] sm:text-4xl">
                Directo de la marca a tu mano
              </h2>
              <p className="mt-4 max-w-md text-[#475569]">
                Nada de intermediarios ni productos dudosos. Trabajamos con proveedores
                verificados y entregamos en todo el país.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-[1.75rem] border border-[#E2E8F0] bg-white p-6 shadow-md shadow-[rgba(37,99,235,0.05)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F8FAFC] text-xl">
                    {feature.icon}
                  </span>
                  <p className="mt-4 font-semibold text-[#0F172A]">{feature.title}</p>
                  <p className="mt-1.5 text-sm leading-6 text-[#475569]">{feature.desc}</p>
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

      {/* ===== FOOTER LEGAL / CONTACTO ===== */}
      <footer className="border-t border-[#E2E8F0]">
        <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-center text-xs font-medium text-[#0F172A] sm:text-sm">
          ⚠️ Venta exclusiva para mayores de 18 años. Este producto contiene nicotina, una
          sustancia química adictiva.
        </div>
        <div className="mx-auto max-w-6xl px-2 py-2 sm:px-2 lg:px-2">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:items-center">
            <div className="flex-shrink-0">
              <img src="/logo.png" alt="The V Society" className="h-20 md:h-90 object-contain" />
            </div>
            <div className="flex flex-col items-center md:items-end text-center md:text-right">
              <p className="max-w-md text-sm text-[#475569]">
                Distribución nacional, venta al por mayor y al detal. Envíos a toda Colombia.
              </p>
              <a
                href="https://wa.me/573137175806"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-[#2563EB] via-[#9333EA] to-[#DC2626] px-5 py-2.5 text-xs font-semibold text-white transition hover:scale-105"
              >
                Escríbenos por WhatsApp
              </a>
              <p className="mt-4 text-xs text-[#64748B]">
                © {new Date().getFullYear()} The V Society. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}