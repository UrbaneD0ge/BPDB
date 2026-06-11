<script>
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();

	import "../app.css";
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>BPDB - Boiled Peanut DataBase</title>
</svelte:head>

<nav>
	<a href="/">Home</a>
	<a href="/submit">Submit to the BPDB</a>
	<a href="/auth/signup">Sign Up</a>
	<a href="/auth/signin">Sign In</a>
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
</style>