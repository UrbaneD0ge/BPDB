<script>
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export let data;
</script>

<h1>Welcome to the BPDB</h1>
<p>Boiled Peanut DataBase</p>

<main>

  <ol>
    {#each data.peanuts as peanut}
    <li><b>{peanut.resto_name}</b>: {peanut.product}</li>
    <ul>
      <li>ID: {peanut.id}</li>
      <li>Submitted: {new Date(peanut.created_at).toLocaleDateString()}</li>
      <li>Location: {peanut?.y}, {peanut?.x}</li>
    </ul>
    {/each}

    <!-- Display the error message if there is one -->
    {#if data.error}
    <p style="color: red;">Error: {data.error}</p>
    {/if}
  </ol>

  <MapLibre
class="map"
center={[-84.3880, 33.7490]}
zoom={12}
style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json" >

{#each data.peanuts as peanut}
    <Marker lnglat={[peanut.x, peanut.y]} anchor="bottom">
      <Popup openOn="click" offset={[0, -60]}>
        <div style="background: white; padding: 5px; border-radius: 3px; border: 1px solid black;">
          <strong>{peanut.resto_name}</strong><br>
          {peanut.product}<br>
          Submitted: {new Date(peanut.created_at).toLocaleDateString()}
        </div>
      </Popup>
    </Marker>
    {/each}
  </MapLibre>

</main>

<style>
  main {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px;
  }
  ol {
    list-style-type: none;
    padding-left: 0;
    width: 35%;
  }

  :global(.map){
    height: 600px;
    width: 65%;
  }
 </style>