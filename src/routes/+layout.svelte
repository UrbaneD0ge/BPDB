<script>
	let { children, data } = $props();

	// console.log(data.session)

	// let user = $derived(data.session);

	import "../app.css";
</script>

<svelte:head>
	<title>BPDB - Boiled Peanut DataBase</title>
</svelte:head>

<nav class="flex justify-between">
	<div>
		<a href="/">Home</a>
		<a href="/submit">Submit to the BPDB</a>
		{#if !data.session}
		<a href="/auth/signup">Sign Up</a>
		<a href="/auth/signin">Sign In</a>
		{/if}
		{#if data.session}
		<form class="inline" method="POST" action="/auth/signout"><button class="hover:underline cursor-pointer" type="submit">Sign Out</button></form>
		{/if}
	</div>

	<div>
		<a class="italic" href='/user/${data.session?.user.id}' data-sveltekit-preload-data="false">{data.session?.user.email}</a>
	</div>
</nav>

<div class="container">

{@render children()}

</div>

<style lang="postcss">
@reference "tailwindcss";

.container {
		padding: 2rem;
		margin: 0 auto;
	}

form > button {
	color: white;
	/* display: inline; */
}
</style>