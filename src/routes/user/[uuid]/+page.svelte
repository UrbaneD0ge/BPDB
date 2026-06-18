<script>
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

let {data, error} = $props()

let ratings = $derived(data.data);
let user = $derived(data?.session.user)
let mapBounds = $derived.by(() => {
    if (!ratings?.length) return undefined;

    const lngs = ratings.map((r) => r.lng);
    const lats = ratings.map((r) => r.lat);

    return [
        Math.min(...lngs),
        Math.min(...lats),
        Math.max(...lngs),
        Math.max(...lats)
    ];
});

$inspect(user);
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
    // center={[ -84.3880, 33.7490 ]}
    bounds={mapBounds}
    fitBoundsOptions={{ padding: 50 }}
    attributionControl={false}
    zoom={15}
    style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
    >

{#each ratings as rating (rating.rating_id)}
    <Marker lnglat={[ rating.lng, rating.lat]} anchor="bottom">
     {#snippet content()}
        <div class="text-3xl">🥜</div>
    {/snippet}
      <Popup openOn="click" offset={[0, -60]}>
        <div style="background: white; padding: 5px; border-radius: 8px; border: 1px solid black;">
          <strong>{rating.resto_name}</strong><br>
          {rating.product}<br>
          Overall Rating: {rating.avg_overall}
          <!-- Submitted: {new Date(rating.created_at).toLocaleDateString()} -->
        </div>
      </Popup>

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
            {#if data.session?.user.id === user.id }
            <th>Delete</th>
            {/if}
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
                {#if rating.rating_user_id === user.id }
                <td><form action="?/delete" method="POST"><input type="number" value={rating.rating_id} name='id' hidden><button class="p-2 bg-red-600 rounded-md cursor-pointer" type="submit">🗑️ </button></form></td>
                {/if}
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