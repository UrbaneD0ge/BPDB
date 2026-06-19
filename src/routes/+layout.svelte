<script>
	let { children, data } = $props();

	// console.log(data.session)
	// let user = $derived(data.session);

	import "../app.css";
</script>

<svelte:head>
	<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥜</text></svg>">
	<title>BPDB - Boiled Peanut DataBase</title>
</svelte:head>

<nav class="flex justify-between font-rounded-light">
	<div>
		<a href="/">Home</a>
		<a href="/submit">Submit to the BPDB</a>
		{#if !data.session}
		<a href="/auth/signup">Sign Up</a>
		<a href="/auth/signin">Sign In</a>
		{/if}
		{#if data.session}
		<form class="inline bg-transparent! text-white" method="POST" action="/auth/signout">
			<input class="hover:underline cursor-pointer" type="submit" value="Sign Out">
		</form>
		{/if}
	</div>

	<div>
		<a class="italic" href='/user/${data.session?.user.id}' data-sveltekit-preload-data="false">{data.session?.user.user_metadata.display_name}</a>
	</div>
</nav>

<div class="p-1 lg:p-10">

	{@render children()}

</div>

<!-- <style lang="postcss">
@reference "tailwindcss";

</style> -->