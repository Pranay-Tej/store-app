<script lang="ts">
	import { ROUTES } from '$lib/constants/routes';

	const { data } = $props();
</script>

<svelte:head>
	<title>Payment &bull; SvelteKit Store</title>
	<meta name="description" content="Payment" />
</svelte:head>

<pre>{JSON.stringify(data.order, null, 2)}</pre>
{#if data.order}
	{#if data.order.paymentLink && data.order.status !== 'paid'}
		<p>
			Order failed. Please try again. <a href={data.order.paymentLink} rel="external">Retry</a>
		</p>
	{:else}
		<p>Order successfully placed</p>
		<a href={ROUTES.order(data.order.id)}>View Order</a>
	{/if}
{/if}
