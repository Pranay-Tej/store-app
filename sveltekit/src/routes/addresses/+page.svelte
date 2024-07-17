<script lang="ts">
	import { enhance } from '$app/forms';
	import { fade, slide } from 'svelte/transition';

	const { data, form } = $props();
</script>

<svelte:head>
	<title>Addresses &bull; SvelteKit Store</title>
	<meta name="description" content="Addresses" />
</svelte:head>

<form method="post" action="?/add" use:enhance>
	<label for="name">Name</label>
	<input type="text" name="name" id="name" required placeholder="Home" />
	<label for="address">Address</label>
	<textarea name="address" id="address" required placeholder="Home address"></textarea>
	<button type="submit">Add address</button>
</form>

{#if form?.success === false}
	<p>Error...</p>
{/if}

{#if data.addresses}
	{#each data.addresses as address}
		<div class="address" in:fade out:slide={{axis: 'x'}}>
			<p>{address.name}</p>
			<p>{address.address}</p>
			<form action="?/delete" method="post" use:enhance>
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
