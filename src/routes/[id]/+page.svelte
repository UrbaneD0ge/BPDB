<script>
    import { page } from '$app/stores';

    let { data} = $props();
</script>

<!-- <svelte:head>
    <title>{data?.resto_name}</title>
</svelte:head> -->

<!-- TODO: Get the review stats from the individual peanut tables -->

    <h1>Restaurant: {data.resto_name}</h1>
