<?php

namespace App\Http\Livewire;

use Livewire\Component;

class CartButton extends Component
{
    public int $count = 0;

    protected $listeners = [
        'cartUpdated' => 'refreshCount',
    ];

    public function mount(): void
    {
        $this->refreshCount();
    }

    public function refreshCount(): void
    {
        $cart = session('cart', []);

        if (!is_array($cart)) {
            $this->count = 0;
            return;
        }

        $this->count = array_reduce(
            $cart,
            fn ($total, $item) => $total + ((isset($item['quantity']) && is_numeric($item['quantity'])) ? (int) $item['quantity'] : 1),
            0
        );
    }

    public function render()
    {
        return view('livewire.cart-button');
    }
}
