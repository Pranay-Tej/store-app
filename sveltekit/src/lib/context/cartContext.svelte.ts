import type { CartItem } from '$lib/schema/CartItemTable';
import { getContext, setContext } from 'svelte';

const CART_CTX = 'cart';

class CartState {
	#items = $state<CartItem[]>([]);

	constructor(items: CartItem[]) {
		this.#items = items;
	}

	get items() {
		return this.#items;
	}

	set items(items: CartItem[]) {
		this.#items = items;
	}
}

export const setCartContext = (cart: CartItem[]) => {
	const cartState = new CartState(cart);
	setContext(CART_CTX, cartState);
	return cartState;
};

export const getCartContext = () => {
	return getContext<ReturnType<typeof setCartContext>>(CART_CTX);
};
