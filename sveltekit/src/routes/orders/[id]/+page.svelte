<script lang="ts">
	const { data } = $props();
</script>

<svelte:head>
	<title>Order &bull; SvelteKit Store</title>
	<meta name="description" content="Order" />
</svelte:head>

<pre>{JSON.stringify(data.order, null, 2)}</pre>
