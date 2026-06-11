<script>
	import favicon from '$lib/assets/favicon.svg';
	let { children, data } = $props();

	// console.log(data.session)

	let user = $derived(data.session);

	import "../app.css";
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>BPDB - Boiled Peanut DataBase</title>
</svelte:head>

<nav class="flex justify-between">
	<div>
		<a href="/">Home</a>
		<a href="/submit">Submit to the BPDB</a>
		<a href="/auth/signup">Sign Up</a>
		<a href="/auth/signin">Sign In</a>
		<a href="/auth/signout">Sign Out</a>
	</div>

	<div>
		<a class="italic" href='/${data.session.user.id}'>{data.session.user.email}</a>
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
</style>