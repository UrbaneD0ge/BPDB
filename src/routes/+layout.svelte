<script>
	import { page } from '$app/state';
	let { children, data } = $props();

	// console.log(data.session)
	// let user = $derived(data.session);

	// $inspect(page.route);

	import "../app.css";
</script>

<svelte:head>
	<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥜</text></svg>">
	<title>BPDB - Boiled Peanut DataBase</title>
</svelte:head>

<nav class="flex justify-between font-rounded-light fixed w-full z-10">
	<div>
		{#if page.route.id !== '/'}
			<a href="/">Home</a>
		{/if}

		{#if page.route.id !== '/auth/welcome'}
			<a href="/auth/welcome">Welcome</a>
		{/if}

		{#if page.route.id !== '/submit'}
			<a href="/submit">Submit</a>
		{/if}

	</div>

	<div>
		{#if !data.session}
		<a href="/auth/signup">Sign Up</a>
		<a href="/auth/signin">Sign In</a>
		{/if}

		{#if data.session}
		<div class="inline-flex items-center">

			<button type="button" class="user-menu-trigger cursor-pointer italic hover:underline text-white font-extrabold" popovertarget="user-menu-popover" popovertargetaction="toggle">
				{data.session.user.user_metadata.display_name}
			</button>
			<div id="user-menu-popover" popover="auto" class="user-menu-popover rounded bg-[#333] p-2 text-white shadow-lg">

				<a href='/user/${data.session.user.id}' data-sveltekit-preload-data="false" class="m-0! p-4 bg-gray-600/90 rounded-lg text-nowrap">My Ratings</a>

				<form method="POST" action="/auth/signout">
					<input class="cursor-pointer hover:underline" type="submit" value="Sign Out">
				</form>
			</div>
		</div>
		{/if}
	</div>
</nav>

<div class="p-1 pt-15 lg:p-15">

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
</style>