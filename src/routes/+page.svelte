<script>
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// export let data;
let { data } = $props();

// console.log(data.peanuts)

</script>

<h1>BPDB: Boiled Peanut DataBase</h1>

<main class="flex justify-between items-start">

  <!-- TODO: Sort by Average Rating -->
  <ol>
    {#each data.peanuts as peanut}
    <h3>{peanut.avg_overall || '-'}</h3>
    <li><a class="text-blue-500 hover:underline" href={`/${peanut.id}`}>{peanut.resto_name}: "{peanut.product}"{peanut.price ? ` - $${peanut.price.toFixed(2)}` : ''}</a></li>
    <ul>
      <li>Submitted: {new Date(peanut.created_at).toLocaleDateString()}</li>
      <!-- <li>Location: {peanut?.y}, {peanut?.x}</li> -->
    </ul><br>
    {/each}

    <!-- Display the error message if there is one -->
    {#if data.error}
    <p style="color: red;">Error: {data.error}</p>
    {/if}
  </ol>

  <MapLibre
  class="h-120 w-3/4"
  center={[-84.3880, 33.7490]}
  zoom={10}
  style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json" >

  {#each data.peanuts as peanut}
    <Marker lnglat={[peanut.x, peanut.y]} anchor="bottom">
        {#snippet content()}
          <div class="text-3xl">🥜</div>
        {/snippet}
      <Popup openOn="click" offset={[0, -60]}>
        <div style="background: white; padding: 5px; border-radius: 8px; border: 1px solid black;">
          <strong>{peanut.resto_name}</strong><br>
          {peanut.product}<br>
          Submitted: {new Date(peanut.created_at).toLocaleDateString()}
        </div>
      </Popup>
    </Marker>
    {/each}
  </MapLibre>

</main>

<style lang="postcss">
@reference "tailwindcss";

  ol {
    list-style-type: none;
    padding-left: 0;
    width: 35%;
  }

  /* :global(.map){
    height: 600px;
    width: 65%;
  } */
 </style>