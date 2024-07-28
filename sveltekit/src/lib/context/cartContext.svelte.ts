import type { CartItem } from '$lib/schema/CartItemTable';
import type { Product } from '$lib/schema/ProductTable';
import { getContext, setContext } from 'svelte';

const CART_CTX = 'cart';

type CartItemWithProduct = CartItem & {
	product: Product;
};

class CartState {
	#items = $state<CartItemWithProduct[]>([]);

	constructor(items: CartItemWithProduct[]) {
		this.#items = items;
	}

	get items() {
		return this.#items;
	}

	set items(items: CartItemWithProduct[]) {
		this.#items = items;
	}
}

export const setCartContext = (cart: CartItemWithProduct[]) => {
	const cartState = new CartState(cart);
	setContext(CART_CTX, cartState);
	return cartState;
};

export const getCartContext = () => {
	return getContext<ReturnType<typeof setCartContext>>(CART_CTX);
};
