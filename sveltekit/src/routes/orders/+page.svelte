<script lang="ts">
	import { ROUTES } from '$lib/constants/routes.js';

	const { data } = $props();
</script>

<svelte:head>
	<title>Orders &bull; SvelteKit Store</title>
	<meta name="description" content="Orders" />
</svelte:head>

<pre>{JSON.stringify(data.orders, null, 2)}</pre>

{#if data.orders}
	{#each data.orders as order (order.id)}
		<div>
			<p>{order.id}</p>
			<a href={ROUTES.order(order.id)}>link</a>
		</div>
	{/each}
{/if}
