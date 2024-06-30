<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { ROUTES } from '$lib/constants/routes';
	import { setUserContext } from '$lib/context/userContext.svelte';
	import { setCartContext } from '$lib/context/cartContext.svelte';

	const { data, children } = $props();

	setUserContext(data.user ?? null);
	let cartState = setCartContext([]);

	$effect(() => {
		cartState.items = data.userCartItems ?? [];
	});

	$inspect(cartState);

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<a href={ROUTES.home}>Home</a>
{#if data.user}
	<form method="post" action="/logout">
		<button>Logout</button>
	</form>
	<a href={ROUTES.cart}>Cart</a>
{:else}
	<a href={ROUTES.login}>Login</a>
	<a href={ROUTES.register}>Register</a>
{/if}

{@render children()}
