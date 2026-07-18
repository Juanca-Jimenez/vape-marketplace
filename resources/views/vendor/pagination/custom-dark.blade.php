@if ($paginator->hasPages())
    <nav role="navigation" aria-label="Paginación" class="mt-8 flex items-center justify-center">
        <ul class="inline-flex items-center -space-x-px">
            {{-- Previous Page Link --}}
            @if ($paginator->onFirstPage())
                <li>
                    <span class="pointer-events-none inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-600">&laquo;</span>
                </li>
            @else
                <li>
                    <a href="{{ $paginator->previousPageUrl() }}" rel="prev" class="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-emerald-600/10">&laquo;</a>
                </li>
            @endif

            {{-- Pagination Elements --}}
            @foreach ($elements as $element)
                {{-- "Three Dots" Separator --}}
                @if (is_string($element))
                    <li><span class="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-500">{{ $element }}</span></li>
                @endif

                {{-- Array Of Links --}}
                @if (is_array($element))
                    @foreach ($element as $page => $url)
                        @if ($page == $paginator->currentPage())
                            <li><span aria-current="page" class="inline-flex items-center rounded-md border border-emerald-500 bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">{{ $page }}</span></li>
                        @else
                            <li><a href="{{ $url }}" class="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white hover:border-emerald-500 hover:text-emerald-400">{{ $page }}</a></li>
                        @endif
                    @endforeach
                @endif
            @endforeach

            {{-- Next Page Link --}}
            @if ($paginator->hasMorePages())
                <li>
                    <a href="{{ $paginator->nextPageUrl() }}" rel="next" class="inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white hover:bg-emerald-600/10">&raquo;</a>
                </li>
            @else
                <li>
                    <span class="pointer-events-none inline-flex items-center rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-600">&raquo;</span>
                </li>
            @endif
        </ul>
    </nav>
@endif
