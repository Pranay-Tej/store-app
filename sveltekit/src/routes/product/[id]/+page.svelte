<script lang="ts">
	import { ROUTES } from '$lib/constants/routes.js';

	const { data } = $props();
</script>

<!-- <pre>{JSON.stringify(data.product, null, 2)}</pre> -->

<a href={ROUTES.home}>Home</a>

<div class="container">
	{#if data?.product}
		<div class="product">
			<div class="img-container">
				<img src={data.product.imageUrl} alt={data.product.title} />
			</div>
			<p>{data.product.title}</p>
		</div>
	{/if}
</div>

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
			height: 24rem;
		}
		img {
			height: 100%;
			object-fit: cover;
			max-width: 100%;
			min-height: 100%;
		}
	}
</style>
