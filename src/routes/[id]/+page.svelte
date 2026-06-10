<script>
import { page } from '$app/stores';
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

    let { data } = $props();

    // svelte-ignore state_referenced_locally
    // console.log(data);

    let peanut = data.data[0].peanut;
    let reviews = data.data[0].reviews;

    // console.log(peanut);
    // console.log(reviews);

</script>

<svelte:head>
    <title>Peanut rating: {peanut.resto_name} {peanut.product}</title>
</svelte:head>

<h1>Restaurant {peanut.id}: {peanut.resto_name}</h1>

<p>Product: {peanut.product}</p>
<p>Location: {peanut.geopoint.x}, {peanut.geopoint.y}</p>
<p>Initially Reviewed: {new Date(peanut.created_at).toLocaleDateString()}</p>

<table>
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

<!-- TODO: Display the restaurant location on the map -->
  <MapLibre
    class="map"
    center={[ peanut.geopoint.x, peanut.geopoint.y ]}
    zoom={15}
    style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json" >

    <Marker lnglat={[peanut.geopoint.x, peanut.geopoint.y]} anchor="bottom">
    </Marker>

  </MapLibre>


<style>
    table {
        border-collapse: collapse;
        width: 100%;
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

    td:nth-child(7) {
        text-align: left;
    }

    td:hover {
        background-color: #f5f5f5;
    }

      /* .map {
    height: 400px;
    width: 400px;
  } */
</style>