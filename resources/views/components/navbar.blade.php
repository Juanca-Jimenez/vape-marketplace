<nav class="bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-md">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
            <a href="{{ url('/') }}" class="text-lg font-semibold text-white hover:text-emerald-400">
                VapeMarket
            </a>
            <div class="hidden items-center gap-4 text-sm text-zinc-400 md:flex">
                <a href="{{ url('/') }}" class="hover:text-white">Inicio</a>
                <a href="{{ url('/catalogo') }}" class="hover:text-white">Catálogo</a>
                <a href="{{ url('/contacto') }}" class="hover:text-white">Contacto</a>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <livewire:cart-button />
        </div>
    </div>
</nav>
