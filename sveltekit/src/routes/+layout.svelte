<script lang="ts">
	import '../app.css';
	import { onNavigate } from '$app/navigation';
	import { ROUTES } from '$lib/constants/routes';
	import { setUserContext } from '$lib/context/userContext.svelte';
	import { setCartContext } from '$lib/context/cartContext.svelte';
	import { navigating } from '$app/stores';

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

{#if $navigating}
	<div class="loading-bar-container">
		<div class="loading-bar"></div>
	</div>
{/if}

<a href={ROUTES.home}>Home</a>
{#if data.user}
	<a href={ROUTES.cart}>Cart</a>
	<a href={ROUTES.addresses}>Addresses</a>
	<a href={ROUTES.orders}>Orders</a>
	<form method="post" action="/logout">
		<button>Logout</button>
	</form>
{:else}
	<a href={ROUTES.login}>Login</a>
	<a href={ROUTES.register}>Register</a>
{/if}

{@render children()}

<style>
	.loading-bar-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 100vw;
		height: 4px;
		z-index: 9999;
	}

	@keyframes indeterminate {
		0% {
			left: -50%;
			width: 50%;
		}
		75%,
		100% {
			left: 100%;
			width: 50%;
		}
	}

	.loading-bar {
		position: absolute;
		top: 0;
		left: 0;
		width: 0%;
		height: 100%;
		background-color: var(--ds-loading-bar-bg);
		border-radius: 500px;
		animation: 2.5s ease-out 0s infinite normal none running indeterminate;
	}
</style>
