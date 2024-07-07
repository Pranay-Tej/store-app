<script lang="ts">
	const { data } = $props();
</script>

<svelte:head>
	<title>Addresses &bull; SvelteKit Store</title>
	<meta name="description" content="Addresses" />
</svelte:head>

<form method="post" action="?/add">
	<label for="name">Name</label>
	<input type="text" name="name" placeholder="Home" id="name" required />
	<label for="address">Address</label>
	<textarea name="address" placeholder="Home address" id="address" required></textarea>
	<button type="submit">Add address</button>
</form>

{#if data.addresses}
	{#each data.addresses as address}
		<div class="address">
			<p>{address.name}</p>
			<p>{address.address}</p>
			<form action="?/delete" method="post">
				<input type="text" name="id" value={address.id} hidden />
				<button>Delete</button>
			</form>
		</div>
	{/each}
{/if}

<style>
	.address {
		border: 1px solid hsl(0, 0%, 80%);
        margin-bottom: 1rem;
	}
</style>
