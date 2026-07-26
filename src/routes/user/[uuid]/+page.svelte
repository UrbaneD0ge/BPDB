<script>
import { enhance } from '$app/forms';
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import { navigating, page } from '$app/state';
import { MediaQuery } from 'svelte/reactivity';
import 'maplibre-gl/dist/maplibre-gl.css';
import Peanut from '$lib/Peanut.svelte';
import FormSubmissionLoader from '$lib/FormSubmissionLoader.svelte';

const large = new MediaQuery('min-width: 1024px');
let {data, error} = $props()

let ratings = $derived(data.ratings);
let user = $derived(data?.session?.user)
let isSubmitting = $state(false);
const isNavigating = $derived(Boolean(navigating.to));
const showLoader = $derived(isSubmitting || isNavigating);

function enhanceDelete() {
    isSubmitting = true;

    return async ({ update }) => {
        await update();
        isSubmitting = false;
    };
}

let mapBounds = $derived.by(() => {
    if (!ratings?.length) return undefined;

    const lngs = ratings.map((r) => r.lng);
    const lats = ratings.map((r) => r.lat);

    // Ensure that when there is only one rating, we create a large enough bounding box around it
    if (ratings.length === 1) {
        const offset = 0.001; // Adjust this value as needed
        return [
            lngs[0] - offset,
            lats[0] - offset,
            lngs[0] + offset,
            lats[0] + offset
        ];
    }

    return [
        Math.min(...lngs),
        Math.min(...lats),
        Math.max(...lngs),
        Math.max(...lats)
    ];
});

$inspect(data);
</script>

<svelte:head>
    <title>User: {ratings[0]?.user_display_name}'s ratings</title>
</svelte:head>

{#if showLoader}
    <FormSubmissionLoader show={showLoader} />
{/if}

<main class="h-svh m-2 lg:m-8 lg:mt-12">

    <div class="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">

{#if data.error}
<h3>{data?.error}</h3>
{/if}

<div class="text-white lg:min-h-60 w-full lg:w-2/5 bg-gray-600/80 p-4 rounded-lg shadow-lg flex flex-row justify-between items-center gap-4">
    <div>
        <h1>User: {data?.user?.display_name}</h1>
        <h2>Joined: {new Date(data?.user?.request_user_created_at).toLocaleDateString()}</h2>
        <h2>Average Rating: <b>{data?.user?.avg_overall_rating?.toFixed(2)}</b></h2>
        <h2>Ratings so far: <b>{ratings.length >= 1 ? ratings.length : 'None!'}</b></h2>
    </div>
    <div>
        <Peanut size={30} clipHeight={100} rotation={0} fillHex={data?.user?.fillhex || '#a38226'} strokeHex={data?.user?.strokehex || '#765d1f'} />
    </div>
</div>

    {#key page.params.uuid}
    <MapLibre
        class="min-h-60 lg:h-75 w-full lg:w-2/5 rounded-lg shadow-lg"
        // center={[ -84.3880, 33.7490 ]}
        bounds={mapBounds}
        fitBoundsOptions={{ padding: 50 }}
        attributionControl={false}
        zoom={ratings.length >= 1 ? 5 : 1}
        style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        >

{#each ratings as rating (rating?.rating_id)}
    <Marker lnglat={[ rating?.lng, rating?.lat]} anchor="bottom">
     {#snippet content()}
        <!-- <div class="text-3xl">🥜</div> -->
         <Peanut size="10" clipHeight={rating?.overall * 10} />
    {/snippet}
      <Popup openOn="click" offset={[0, -30]}>
        <div class="bg-gray-600/90 text-white" style="padding: 5px; border-radius: 8px; border: 1px solid black;">
          <h3><strong>{rating?.resto_name}</strong></h3>
          "{rating?.product}"<br>
          Overall Rating: <b>{rating?.overall}</b>
          <!-- Submitted: {new Date(rating?.created_at).toLocaleDateString()} -->
        </div>
      </Popup>

    </Marker>
{/each}

    </MapLibre>
    {/key}
</div>

<table class="w-full border-collapse border border-gray-500 bg-gray-300/75 rounded-lg shadow-lg overflow-hidden mt-5">
    <tbody>
        {#if large.current}
        <tr>
            <!-- <th>rating ID</th> -->
            <th hidden={!large.current}>Restaurant<br>"Product"</th>
            <th>Overall</th>
            <th>Doneness</th>
            <th>Brine</th>
            <th>Salty</th>
            <th>Spicy</th>
            <th>Portion</th>
            <th hidden={!large.current}>Notes</th>
            {#if page.params.uuid === '$' + user?.id }
            <th hidden={!large.current}>Delete</th>
            {/if}
        </tr>
    {/if}
    </tbody>

    {#if ratings.length > 0}
        {#each ratings as rating (rating?.rating_id)}
        <tbody>
        {#if !large.current}
            <tr>
                <th colspan="6"><a href="/{rating?.resto_prod}">{rating?.resto_name}</a><br>"{rating?.product}"</th>
            </tr>
            <tr>
                <td>Overall</td>
                <td>Doneness</td>
                <td>Brine</td>
                <td>Salty</td>
                <td>Spicy</td>
                <td>Portion</td>
            </tr>
        {/if}
            <tr>
                <!-- <td>{rating.id}</td> -->
                <td hidden={!large.current}><a href="/{rating?.resto_prod}">{rating?.resto_name}</a><br>"{rating?.product}"</td>
                <td><b>{rating?.overall}</b></td>
                <td>{rating?.done}</td>
                <td>{rating?.brine}</td>
                <td>{rating?.salty}</td>
                <td>{rating?.spicy}</td>
                <td>{rating?.servings}</td>

                <td hidden={!large.current}>{rating?.notes || '-'}</td>

                {#if page.params.uuid === '$' + user?.id }
                <td hidden={!large.current}><form action="?/delete" method="POST" class="bg-transparent!" use:enhance={enhanceDelete}><input type="number" value={rating?.rating_id} name='id' hidden><button class="p-2 bg-red-600 rounded-md cursor-pointer disabled:opacity-60 disabled:cursor-wait" type="submit" disabled={showLoader}>🗑️ </button></form></td>
                {/if}
            </tr>
        {#if !large.current}
            <tr>
                <td colspan={5}>{rating?.notes || '-'}</td>
                {#if page.params.uuid === '$' + user?.id }
                <td><form action="?/delete" method="POST" class="bg-transparent!" use:enhance={enhanceDelete}><input type="number" value={rating?.rating_id} name='id' hidden><button class="p-2 bg-red-600 rounded-md cursor-pointer disabled:opacity-60 disabled:cursor-wait" type="submit" disabled={showLoader}>🗑️ </button></form></td>
                {/if}
            </tr>
        {/if}
        </tbody>
        {/each}
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

    h2 {
        font-size: 1.5em;
    }

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

    /* td:nth-child(8) {
        text-align: left;
    } */

    tr:hover td {
        background-color: #f5f5f5;
    }

    a {
        text-decoration: underline;
    }

    :global(.maplibregl-popup-content) {
        font-family: "M PLUS Rounded 1c", sans-serif !important;
        font-weight: 400;
        font-style: normal;
        background-color: transparent !important;
        box-shadow: none !important;
    }

    :global(.maplibregl-popup-tip) {
        border-top-color: #4a5565 !important; /* Tailwind's gray-600 */
        border-bottom-color: #4a5565 !important; /* Tailwind's gray-600 */
    }

    :global(.maplibregl-popup-close-button) {
        padding: 1rem 1rem !important;
        font-size: 1rem !important;
        color: white;
    }

    @media (max-width: 640px) {

        th {
            padding: 2px;
        }

        td {
            padding: 0;
        }
    }
</style>