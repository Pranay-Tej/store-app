<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { API_ROUTES } from '$lib/constants/apiRoutes.js';
	import { ROUTE_DATA_KEYS } from '$lib/constants/routeDataKeys';
	import { ROUTES } from '$lib/constants/routes.js';
	import { getCartContext } from '$lib/context/cartContext.svelte.js';
	import { getUserContext } from '$lib/context/userContext.svelte.js';
	import { resolvePromise } from '$lib/utils/resolvePromise.js';
	import axios from 'axios';

	const { data } = $props();
	const product = $derived(data.product);
	const cartState = getCartContext();
	const userState = getUserContext();
	const cartItem = $derived(
		cartState?.items?.find((item) => item.productId === product?.id) ?? null
	);
	let isUpdateButtonsDisabled = $state(false);

	const handleAddToCart = async () => {
		if (!product) {
			return;
		}
		isUpdateButtonsDisabled = true;
		const [res, err] = await resolvePromise(
			axios.post(API_ROUTES.addToCart, {
				productId: product.id
			})
		);
		isUpdateButtonsDisabled = false;
		if (err || res?.status !== 200) {
			return;
		}

		invalidate(ROUTE_DATA_KEYS.appRootLayout);
	};
</script>

<svelte:head>
	<title>Buy {product?.title ?? 'from'} &bull; SvelteKit Store</title>
	<meta name="description" content={product?.description} />
</svelte:head>

{#await data.product}
	<p>Loading...</p>
{:then productItem}
	<div class="container">
		{#if productItem}
			<div class="product">
				<div class="img-container">
					<img
						src={productItem.imageUrl}
						alt="product"
						style:--product-image="image-{productItem.id}"
					/>
				</div>
				<div>
					<p>{productItem.title}</p>
					{#if userState.user !== null}
						{#if cartItem === null || cartItem.quantity === 0}
							<button onclick={handleAddToCart} disabled={isUpdateButtonsDisabled}
								>Add to cart</button
							>
						{:else}
							<a href={ROUTES.cart}>Go to cart</a>
						{/if}
					{:else}
						<a href={ROUTES.login}>Login to add to cart</a>
					{/if}
				</div>
			</div>
		{/if}
	</div>
{/await}

<style>
	.container {
		max-width: 80rem;
		margin: 0 auto;
	}
	.product {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		align-items: center;
		.img-container {
			height: 30rem;
		}
		img {
			height: 100%;
			object-fit: cover;
			max-width: 100%;
			min-height: 100%;
			view-transition-name: var(--product-image);
		}
	}
</style>
