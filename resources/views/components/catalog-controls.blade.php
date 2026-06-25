@props(['products'])

<div class="mb-4 flex items-center justify-between gap-4">
    <div class="text-sm text-zinc-400">
        Mostrando {{ $products->count() }} de {{ $products->total() }} productos
    </div>

    <div class="ml-auto">
        <form method="GET" class="flex items-center gap-2">
            <label for="sort" class="sr-only">Ordenar por:</label>
            <div class="relative inline-block">
                <select
                    id="sort"
                    name="sort"
                    onchange="this.form.submit()"
                    class="block appearance-none rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 pr-8 text-sm text-white placeholder-zinc-400 focus:border-emerald-400 focus:outline-none"
                >
                    <option value="">Ordenar por: Más recientes</option>
                    <option value="price_asc" {{ request('sort') == 'price_asc' ? 'selected' : '' }}>Menor precio</option>
                    <option value="price_desc" {{ request('sort') == 'price_desc' ? 'selected' : '' }}>Mayor precio</option>
                </select>

                <svg class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </form>
    </div>
</div>
