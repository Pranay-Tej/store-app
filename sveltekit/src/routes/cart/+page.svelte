<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { API_ROUTES } from '$lib/constants/apiRoutes';
	import { ROUTE_DATA_KEYS } from '$lib/constants/routeDataKeys';
	import { ROUTES } from '$lib/constants/routes';
	import { getCartContext } from '$lib/context/cartContext.svelte';
	import type { CartItem } from '$lib/schema/CartItemTable';
	import { resolvePromise } from '$lib/utils/resolvePromise.js';
	import axios from 'axios';

	const { data } = $props();

	const cartState = getCartContext();

	const cartItems = $derived(cartState.items);

	let isUpdateButtonsDisabled = $state(false);
	let selectedAddress = $state(null);

	const handleDecreaseQuantity = async (cartItem: CartItem) => {
		if (!cartItem) {
			return;
		}
		isUpdateButtonsDisabled = true;
		const [res, err] = await resolvePromise(
			axios.post(API_ROUTES.updateCartItem(cartItem.id), {
				quantity: cartItem.quantity - 1
			})
		);
		isUpdateButtonsDisabled = false;
		if (err || res?.status !== 200) {
			return;
		}

		invalidate(ROUTE_DATA_KEYS.appRootLayout);
	};

	const handleIncreaseQuantity = async (cartItem: CartItem) => {
		if (!cartItem) {
			return;
		}
		isUpdateButtonsDisabled = true;
		const [res, err] = await resolvePromise(
			axios.post(API_ROUTES.updateCartItem(cartItem.id), {
				quantity: cartItem.quantity + 1
			})
		);
		isUpdateButtonsDisabled = false;
		if (err || res?.status !== 200) {
			return;
		}

		invalidate(ROUTE_DATA_KEYS.appRootLayout);
	};

	const handleRemove = async (cartItemId: string) => {
		if (!cartItemId) {
			return;
		}

		isUpdateButtonsDisabled = true;
		const [res, err] = await resolvePromise(axios.delete(API_ROUTES.deleteCartItem(cartItemId)));
		isUpdateButtonsDisabled = false;
		if (err || res?.status !== 200) {
			return;
		}

		invalidate(ROUTE_DATA_KEYS.appRootLayout);
	};
</script>

<svelte:head>
	<title>Cart &bull; SvelteKit Store</title>
	<meta name="description" content="Cart" />
</svelte:head>

{#if cartItems}
	<h2>Cart</h2>
	{#each cartItems as cartItem (cartItem.id)}
		<div class="cart-item">
			<a href={ROUTES.product(cartItem.product.id)}>
				<img
					src={cartItem.product.imageUrl}
					alt="cart-item"
					class="product-image"
					style:--product-image="image-{cartItem.product.id}"
				/>
			</a>
			<div>
				<p>{cartItem.product.title}</p>
				<p>{cartItem.product.price}</p>
				<div>
					<button
						onclick={() => handleDecreaseQuantity(cartItem)}
						disabled={cartItem?.quantity === 1 || isUpdateButtonsDisabled}>-</button
					>
					<span>{cartItem?.quantity}</span>
					<button
						onclick={() => handleIncreaseQuantity(cartItem)}
						disabled={isUpdateButtonsDisabled}>+</button
					>
					<button onclick={() => handleRemove(cartItem.id)}>Remove</button>
				</div>
			</div>
		</div>
	{/each}
{/if}

<hr />

<h2>Select Address</h2>

{#if data.addresses}
	{#each data.addresses as address (address.id)}
		<div>
			<label for={address.id}>
				<input type="radio" id={address.id} bind:group={selectedAddress} value={address.id} />
				{address.name}
			</label>
		</div>
	{/each}
{/if}

{#if selectedAddress && cartItems.length > 0}
	<form action="?/order" method="post">
		<input type="text" name="addressId" value={selectedAddress} hidden />
		<button>Place Order</button>
	</form>
{/if}

<style>
	.cart-item {
		display: flex;
		gap: 2rem;
	}
	.product-image {
		max-width: 100px;
		max-height: 100px;
		view-transition-name: var(--product-image);
	}
</style>
