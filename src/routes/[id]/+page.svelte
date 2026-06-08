<script>
    import MapLibre, { Marker, Popup } from 'svelte-maplibre';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>{page?.data.peanut.resto_name}</title>
</svelte:head>