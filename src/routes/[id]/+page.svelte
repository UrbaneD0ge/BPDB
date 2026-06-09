<script>
    import { page } from '$app/stores';

    let { data } = $props();

    console.log('Page data:', data);

    let peanut = data?.peanut;
</script>

<svelte:head>
    <title>Peanut rating: {peanut.resto_name} {peanut.product}</title>
</svelte:head>

<h1>Restaurant {peanut.id}: {peanut.resto_name}</h1>
<h2>Peanut: {peanut.product}</h2>

<!-- TODO: Get the review stats from the individual peanut tables as a subquery -->

<!-- TODO: Display the restaurant location on the map -->

