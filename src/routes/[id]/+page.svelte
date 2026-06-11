<script>
import { page } from '$app/stores';
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

    let { data } = $props();

    // svelte-ignore state_referenced_locally
    let peanut = data.data[0].peanut;
    // console.log(peanut);

    // svelte-ignore state_referenced_locally
    let reviews = data.data[0].reviews;
    // console.log(reviews);

</script>

<svelte:head>
    <title>Peanut rating: {peanut.resto_name} {peanut.product}</title>
</svelte:head>

<div class="flex flex-row justify-between gap-4">

    <div>
        <h1>Restaurant {peanut.id}: {peanut.resto_name}</h1>

        <p>Product: {peanut.product}</p>
        <!-- <p>Location: {peanut.geopoint.x}, {peanut.geopoint.y}</p> -->
        <p>Initially Reviewed: {new Date(peanut.created_at).toLocaleDateString()}</p>
    </div>

<!-- TODO: Display the restaurant location on the map -->
  <MapLibre
    class="h-60 w-80"
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

<table class="table-auto w-full border-collapse border border-gray-300">
    <tbody>
        <tr>
            <!-- <th>Review ID</th> -->
            <th>Overall</th>
            <th>Done</th>
            <th>Brine</th>
            <th>Salty</th>
            <th>Spicy</th>
            <th>Price</th>
            <th>Notes</th>
        </tr>
    </tbody>

    {#if reviews[0] !== null}
        {#each reviews as review}
        <tbody>
            <tr>
                <!-- <td>{review.id}</td> -->
                <td><b>{review?.overall}</b></td>
                <td>{review?.done}</td>
                <td>{review?.brine}</td>
                <td>{review?.salty}</td>
                <td>{review?.spicy}</td>
                <td>{review?.price}</td>
                <td>{review?.notes || '-'}</td>
            </tr>
        </tbody>
        {/each}
    {:else}
        <tbody>
            <tr>
                <td colspan="8"><i>No reviews yet.</i></td>
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

    td:hover {
        background-color: #f5f5f5;
    }

    .map-container {
        margin-top: 20px;
    }
</style>