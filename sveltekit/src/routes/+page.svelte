<script lang="ts">
	import { ROUTES } from '$lib/constants/routes.js';

	const { data } = $props();
	const products = $derived(data.products);
</script>

<svelte:head>
	<title>SvelteKit Store</title>
	<meta name="description" content="E-commerce app build with SveleKit ecosystem" />
</svelte:head>

{#if products}
	<div class="product-list">
		{#each products as product (product.id)}
			<a href={ROUTES.product(product.id)} class="product">
				<div class="img-container">
					<img src={product.imageUrl} alt="product" style:--product-image="image-{product.id}" />
				</div>
				<p>{product.title}</p>
			</a>
		{/each}
	</div>
{/if}

<style>
	.product-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
		gap: 2rem;
	}

	.product {
		display: grid;
		grid-template-rows: 430px auto;
		text-decoration: none;
		.img-container {
			min-height: 100%;
		}
		img {
			object-fit: cover;
			max-width: 100%;
			min-height: 100%;
			view-transition-name: var(--product-image);
		}
	}
</style>
