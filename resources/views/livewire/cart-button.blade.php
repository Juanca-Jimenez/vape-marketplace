<a
    href="{{ route('carrito') }}"
    class="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-zinc-100 transition duration-200 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
    aria-label="Ir al carrito"
>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 21h.01M15 21h.01" />
    </svg>

    @if ($count > 0)
        <span
            class="absolute -right-1 -top-1 inline-flex min-h-[1.5rem] min-w-[1.5rem] items-center justify-center rounded-full bg-emerald-500 px-2 text-xs font-semibold text-white shadow-lg shadow-black/30"
        >
            {{ $count }}
        </span>
    @endif
</a>
