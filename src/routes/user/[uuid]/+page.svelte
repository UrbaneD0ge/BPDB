<script>
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
let {data, error} = $props()

let ratings = $derived(data.data);
let user = $derived(data?.session.user)
$inspect(ratings);
</script>

<svelte:head>
    <title>User: {user.user_metadata.display_name}'s ratings</title>
</svelte:head>

<div class="flex flex-row items-center justify-between gap-4">

{#if data.error}
<h3>{data?.error}</h3>
{/if}
<div>
    <h1>User: {user.user_metadata.display_name}</h1>
    <h2>eMail: {user.email}</h2>
    <h3>Ratings so far: {ratings.length > 1 ? ratings.length : 'None!'}</h3>
</div>

  <MapLibre
    class="h-60 w-80 rounded-lg shadow-lg"
    center={[ -84.3880, 33.7490 ]}
    zoom={15}
    style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
    >

{#each ratings as rating (rating.rating_id)}
    <Marker lnglat={[ rating.lng, rating.lat]} anchor="bottom">
     {#snippet content()}
        <div class="text-3xl">🥜</div>
    {/snippet}
    </Marker>
{/each}
  </MapLibre>
</div>

<table class="table-auto w-full border-collapse border border-gray-500 bg-gray-300/75 rounded-lg overflow-hidden">
    <tbody>
        <tr>
            <!-- <th>rating ID</th> -->
            <th>Restaurant<br>"Product"</th>
            <th>Overall</th>
            <th>Done</th>
            <th>Brine</th>
            <th>Salty</th>
            <th>Spicy</th>
            <!-- <th>Price</th> -->
            <th>Notes</th>
            <th>Delete</th>
        </tr>
    </tbody>

    {#if 1}
        {#each ratings as rating (rating.rating_id)}
        <tbody>
            <tr>
                <!-- <td>{rating.id}</td> -->
                 <td><a href="/{rating.resto_prod}">{rating.resto_name}</a><br>"{rating.product}"</td>
                <td><b>{rating?.overall}</b></td>
                <td>{rating?.done}</td>
                <td>{rating?.brine}</td>
                <td>{rating?.salty}</td>
                <td>{rating?.spicy}</td>
                <!-- <td>{rating?.price}</td> -->
                <td>{rating?.notes || '-'}</td>
                <td><form action="?/delete" method="POST"><input type="
                    number" value={rating.rating_id} name='id' hidden><button class="p-2 bg-red-600 rounded-md cursor-pointer" type="submit">🗑️</button></form></td>
            </tr>
        </tbody>
        {/each}
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

    tr:hover td {
        background-color: #f5f5f5;
    }

    a {
        text-decoration: underline;
    }

</style>