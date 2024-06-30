<script lang="ts">
	const { data } = $props();
</script>

<pre>{JSON.stringify(data.cartItems, null, 2)}</pre>
