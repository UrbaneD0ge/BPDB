<script>
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import { MediaQuery } from 'svelte/reactivity';
import Peanut from '$lib/Peanut.svelte';
import 'maplibre-gl/dist/maplibre-gl.css';

const large = new MediaQuery('min-width: 1024px');
let { data } = $props();
// $inspect(data);

let peanut = $derived(data?.data[0]?.peanut);
let ratings = $derived(data?.data[0]?.reviews);

let avgOverall = $derived.by(() => {
    if (!ratings || ratings.length === 0) return 0;
    return (ratings.reduce((sum, r) => sum + (r?.overall || 0), 0) / ratings.length).toFixed(2);
});

let avgServings = $derived.by(() => {
    if (!ratings || ratings.length === 0) return 0;
    return (ratings.reduce((sum, r) => sum + (r?.servings || 0), 0) / ratings.length).toFixed(2);
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

let avgDone = $derived.by(() => {
    if (!ratings || ratings.length === 0) return 0;
    return (ratings.reduce((sum, r) => sum + (r?.done || 0), 0) / ratings.length).toFixed(2);
});

</script>

<svelte:head>
    <title>Peanut rating: {peanut.resto_name} {peanut.product}</title>
</svelte:head>

<main class="h-svh px-2 py-2 lg:px-8 lg:py-12">

    <div class="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">

        <!-- RESTAURANT PROFILE CARD -->
        <div class="text-white w-full lg:w-2/5 bg-gray-600/80 p-4 rounded-lg shadow-lg">

            <div class="flex flex-row justify-between">
                <h1 class="font-rounded-extrabold">{peanut.resto_name}:<br>"{peanut.product}"</h1>
                <Peanut size={22} clipHeight={avgOverall * 10} rotation={0} />
                <!-- <h1>Overall: {peanut.avg_overall}</h1> -->
            </div>

            <div>
                <p>Address: {peanut.address}</p>
                <p>Price: ${peanut?.price?.toFixed(2) || 'unknown'}</p>
                <!-- <p>Location: {peanut.geopoint.x}, {peanut.geopoint.y}</p> -->
                <p>Initially rated: {new Date(peanut.created_at).toLocaleDateString()}</p><br>
                <p><b>{ ratings[0] === null ? '0' : ratings.length}</b> rating{ratings.length >= 1 ? 's' : ''} So Far: {#if data.session}<a href='/{peanut.id}/rate' class="bg-green-500 p-2 rounded-md text-nowrap">Add Yours!</a>{/if}</p>

            </div>
        </div>

<!-- TODO: Display the restaurant location on the map -->
  <MapLibre
    class="min-h-60 lg:h-75  w-full lg:w-2/5 rounded-lg shadow-lg"
    center={[ peanut.geopoint.x, peanut.geopoint.y ]}
    zoom={15}
    style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
    >


    <Marker lnglat={[peanut.geopoint.x, peanut.geopoint.y]} anchor="bottom">
    {#snippet content()}
        <!-- <div class="text-3xl">🥜</div> -->
        <Peanut size="16" clipHeight={avgOverall * 10} />
    {/snippet}
    </Marker>

  </MapLibre>
</div>

<table class="table-auto w-full border-collapse border border-gray-500 bg-gray-300/75 rounded-lg overflow-hidden shadow-sm/25">
    <tbody>
        <tr>
            <!-- <th>rating ID</th> -->
            <th>Overall</th>
            <th>Doneness</th>
            <th>Brine</th>
            <th>Salty</th>
            <th>Spicy</th>
            <th>Portion</th>
            <th hidden={!large.current}>Notes</th>
        </tr>
    </tbody>

    {#if ratings[0] !== null}
    {#each ratings as rating}
    <tbody>
            <tr>
                <!-- <td>{rating.id}</td> -->
                <td><b>{rating?.overall}</b></td>
                <td>{rating?.done}</td>
                <td>{rating?.brine}</td>
                <td>{rating?.salty}</td>
                <td>{rating?.spicy}</td>
                <td>{rating?.servings}</td>
                <td hidden={!large.current}>{rating?.notes || '-'}<br><span class="text-sm italic text-gray-500"> {new Date(rating?.created_at).toLocaleDateString()} - <a href='/user/${rating?.user_id}'>{rating?.display_name}</a></span></td>
            </tr>
        {#if !large.current}
            <tr>
                <td colspan="6">{rating?.notes || '-'}<br><span class="text-sm italic text-gray-500"> {new Date(rating?.created_at).toLocaleDateString()} - <a href='/user/${rating?.user_id}'>{rating?.display_name}</a></span></td>
            </tr>
        {/if}
        </tbody>
        {/each}
        <tbody>
            <tr class="italic">
                <td>{avgOverall}</td>
                <td>{avgDone}</td>
                <td>{avgBrine}</td>
                <td>{avgSalty}</td>
                <td>{avgSpicy}</td>
                <td>{avgServings}</td>
                <td hidden={!large.current}>-- Averages --</td>
            </tr>
        </tbody>
    {:else}
        <tbody>
            <tr>
                <td colspan={large.current ? 8 : 7}><i>No ratings yet.</i></td>
            </tr>
        </tbody>
    {/if}
    </table>

</main>

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

    a {
        text-decoration: underline;
    }

    @media (max-width: 420px) {
        td,th {
            /* font-size: 0.8rem; */
            padding: 4px;
            margin: 0;
        }

        h1 {
            font-size: 1.6rem;
        }

        p {
            font-size: 1.2rem;
        }
    }
</style>