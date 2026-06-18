<script>
import { page } from '$app/state';
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

let { data } = $props();
// $inspect(data);

let peanut = $derived(data?.data[0]?.peanut);
let ratings = $derived(data?.data[0]?.reviews);

let avgOverall = $derived.by(() => {
    if (!ratings || ratings.length === 0) return 0;
    return (ratings.reduce((sum, r) => sum + (r?.overall || 0), 0) / ratings.length).toFixed(2);
});

let avgDone = $derived.by(() => {
    if (!ratings || ratings.length === 0) return 0;
    return (ratings.reduce((sum, r) => sum + (r?.done || 0), 0) / ratings.length).toFixed(2);
});

let avgBrine = $derived.by(() => {
    if (!ratings || ratings.length === 0) return 0;
    return (ratings.reduce((sum, r) => sum + (r?.brine || 0), 0) / ratings.length).toFixed(2);
});

let avgSalty = $derived.by(() => {
    if (!ratings || ratings.length === 0) return 0;
    return (ratings.reduce((sum, r) => sum + (r?.salty || 0), 0) / ratings.length).toFixed(2);
});

let avgSpicy = $derived.by(() => {
    if (!ratings || ratings.length === 0) return 0;
    return (ratings.reduce((sum, r) => sum + (r?.spicy || 0), 0) / ratings.length).toFixed(2);
});



</script>

<svelte:head>
    <title>Peanut rating: {peanut.resto_name} {peanut.product}</title>
</svelte:head>

<div class="flex flex-row items-center justify-between gap-4">

    <div>
        <h1>{peanut.resto_name}: "{peanut.product}"</h1>
        <!-- <h1>Overall: {peanut.avg_overall}</h1> -->
        <p>Address: {peanut.address}</p>
        <p>Price: ${peanut?.price?.toFixed(2) || 'unknown'}</p>
        <!-- <p>Location: {peanut.geopoint.x}, {peanut.geopoint.y}</p> -->
        <p>Initially rated: {new Date(peanut.created_at).toLocaleDateString()}</p>
        <p>{ ratings[0] === null ? '0' : ratings.length} rating{ratings.length > 1 ? 's' : ''} So Far: {#if data.session}<a href='/{peanut.id}/rate' class="bg-green-500 p-2 rounded-md">Add Yours!</a>{/if}</p>
    </div>

<!-- TODO: Display the restaurant location on the map -->
  <MapLibre
    class="h-60 w-80 rounded-lg shadow-lg"
    center={[ peanut.geopoint.x, peanut.geopoint.y ]}
    zoom={15}
    style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
    >


    <Marker lnglat={[peanut.geopoint.x, peanut.geopoint.y]} anchor="bottom">
     {#snippet content()}
        <div class="text-3xl">🥜</div>
    {/snippet}
    </Marker>

  </MapLibre>
</div>

<table class="table-auto w-full border-collapse border border-gray-500 bg-gray-300/75 rounded-lg overflow-hidden">
    <tbody>
        <tr>
            <!-- <th>rating ID</th> -->
            <th>Overall</th>
            <th>Done</th>
            <th>Brine</th>
            <th>Salty</th>
            <th>Spicy</th>
            <!-- <th>Price</th> -->
            <th>Notes</th>
        </tr>
    </tbody>

    {#if ratings !== undefined}
        {#each ratings as rating}
        <tbody>
            <tr>
                <!-- <td>{rating.id}</td> -->
                <td><b>{rating?.overall}</b></td>
                <td>{rating?.done}</td>
                <td>{rating?.brine}</td>
                <td>{rating?.salty}</td>
                <td>{rating?.spicy}</td>
                <!-- <td>{rating?.price}</td> -->
                <td>{rating?.notes || '-'}</td>
            </tr>
        </tbody>
        {/each}
        <tbody>
            <tr class="italic">
                <td>{avgOverall}</td>
                <td>{avgDone}</td>
                <td>{avgBrine}</td>
                <td>{avgSalty}</td>
                <td>{avgSpicy}</td>
                <td>-</td>
            </tr>
        </tbody>
    {:else}
        <tbody>
            <tr>
                <td colspan="8"><i>No ratings yet.</i></td>
            </tr>
        </tbody>
    {/if}
    </table>


<style lang="postcss">
@reference "tailwindcss";

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: center;
    }

    th {
        background-color: #f2f2f2;
    }

    td:first-child {
        font-size: 1.2em;
    }

    td:nth-child(7) {
        text-align: left;
    }

    tr:hover {
        background-color: #f5f5f5;
    }
</style>