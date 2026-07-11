<script>
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import "../app.css";
	import Peanut from "$lib/Peanut.svelte";

	let { children, data } = $props();

	let fillHex = $state("#a38226");
	let strokeHex = $state("#765d1f");

	const applySavedColors = () => {
		const savedFillHex = localStorage.getItem('fillHex');
		const savedStrokeHex = localStorage.getItem('strokeHex');
		if (savedFillHex) fillHex = savedFillHex;
		if (savedStrokeHex) strokeHex = savedStrokeHex;
	};

	const hidePopover = () => {
		const popover = document.getElementById('user-menu-popover');
		if (popover) {
			popover.hidePopover();
		}
	};

	onMount(() => {
		applySavedColors();

		const handlePeanutColorsChanged = () => applySavedColors();
		const handleStorage = (event) => {
			if (event.key === 'fillHex' || event.key === 'strokeHex') {
				applySavedColors();
			}
		};

		window.addEventListener('peanut-colors-changed', handlePeanutColorsChanged);
		window.addEventListener('storage', handleStorage);

		return () => {
			window.removeEventListener('peanut-colors-changed', handlePeanutColorsChanged);
			window.removeEventListener('storage', handleStorage);
		};
	});

  onNavigate((navigation) => {
    // Check if the browser supports the API
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

	onMount(() => {
		if (!('serviceWorker' in navigator)) return;

		navigator.serviceWorker.register('/service-worker.js', { type: 'module' }).catch((error) => {
			console.error('Service worker registration failed:', error);
		});
	});

</script>

<svelte:head>
	<link rel="icon" href="/peanut_icon.svg">
	<title>BPDB - Boiled Peanut DataBase</title>
</svelte:head>

<nav class="flex justify-between items-center font-rounded-light fixed w-full z-10">
	<div class="flex lg:gap-4 items-center">
		<!-- {#if page.route.id !== '/'}
			<a href="/">Home</a>
		{/if} -->

		{#if page.route.id !== '/submit' && data?.session}
		<a href="/submit">Submit</a>
		{/if}

	</div>

	<div class="flex items-center">
		<h1 class="m-0!">
			<a id="peanut-logo-link" href="/" class="inline-flex items-center gap-2 text-2xl font-rounded-extrabold! font-extrabold m-0! leading-none">
				<span id="peanut-logo-wrap" aria-hidden="true">
					<Peanut id="peanut-logo" size={10} clipHeight={100} rotation={45} {fillHex} {strokeHex} disableHoverEffects={true} />
				</span>
				<span>BPDB</span>
			</a>
		</h1>
	</div>

	<div>

		{#if !data?.session}
		<a href="/auth/signup">Sign Up</a>
		<a href="/auth/signin">Sign In</a>
		{/if}

		{#if data?.session}
		<div class="inline-flex items-center m-2">

			<button type="button" class="user-menu-trigger cursor-pointer italic hover:underline text-white font-extrabold" popovertarget="user-menu-popover" popovertargetaction="toggle">
				{data?.session?.user?.user_metadata?.display_name}
			</button>
			<div id="user-menu-popover" popover="auto" class="user-menu-popover rounded bg-[#333] p-2 text-white shadow-lg">

				{#if page.route.id !== '/auth/welcome'}
					<a class="m-0! mt-[.35rem]! p-4 bg-gray-600/90 rounded-lg text-nowrap" href="/auth/welcome" onclick={hidePopover}>Welcome</a>
				{/if}

				{#if page.route.id !== '/peanut'}
					<a class="m-0! mt-[.35rem]! p-4 bg-gray-600/90 rounded-lg text-nowrap" href="/peanut" onclick={hidePopover}>Peanut</a>
				{/if}

				{#if page.params.uuid != `$${data?.session?.user?.id}`}
				<a href='/user/${data?.session?.user?.id}' data-sveltekit-preload-data="false" class="m-0! mt-[.35rem]! p-4 bg-gray-600/90 rounded-lg text-nowrap" onclick={hidePopover}>My Ratings</a>
				{/if}

				<form method="POST" action="/auth/signout">
					<input class="cursor-pointer hover:underline" type="submit" value="Sign Out" onclick={hidePopover}>
				</form>
			</div>
		</div>
		{/if}
	</div>
</nav>

<!-- END OF NAV BAR, MAIN DIV BELOW -->

<div class="flex flex-col lg:h-auto mt-auto pt-10 lg:pt-0">

	{@render children()}

</div>

<style>
	@position-try --user-menu-above-right {
		bottom: anchor(top);
		left: anchor(right);
		transform: translateX(-100%);
	}

	@position-try --user-menu-below-left {
		top: anchor(bottom);
		left: anchor(left);
	}

	.user-menu-trigger {
		anchor-name: --user-menu-anchor;
	}

	.user-menu-popover {
		position: fixed;
		top: anchor(bottom);
		left: anchor(right);
		transform: translateX(-100%);
		position-try-fallbacks: --user-menu-above-right, --user-menu-below-left;
		margin: 0;
	}

	.user-menu-popover a,
	.user-menu-popover form {
		display: block;
	}

	.user-menu-popover form {
		margin-top: 0.35rem;
	}

	:global(nav) {
		view-transition-name: nav;
	}

	#peanut-logo-wrap :global(svg) {
		display: inline-block;
		vertical-align: middle;
	}

	@media (max-width: 380px) {
		#peanut-logo-wrap :global(svg) {
			width: 2rem;
			height: 2rem;
		}

		#peanut-logo-link {
			/* Remove the link text */
			font-size: 0;
		}

	}

</style>