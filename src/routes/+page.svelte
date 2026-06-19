<script>
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// export let data;
let { data } = $props();
const star = '🥜';

let mapBounds = $derived.by(() => {
    if (!data.peanuts?.length) return undefined;
    // Filter out peanuts without valid coordinates
    const validPeanuts = data.peanuts.filter(p => p.x !== null && p.y !== null);
    if (validPeanuts.length === 0) return undefined;

    const lons = validPeanuts.map((r) => r.x);
    const lats = validPeanuts.map((r) => r.y);

    return [
        Math.min(...lons),
        Math.min(...lats),
        Math.max(...lons),
        Math.max(...lats)
    ];
});

</script>

<h1>BPDB: Boiled Peanut DataBase</h1>

<main class="flex flex-col-reverse lg:flex-row justify-between items-start m-4 gap-4">

  <ol class="flex flex-col w-full lg:w-1/3">
    {#each data.peanuts as peanut}
    <div class="border border-black rounded-lg bg-gray-600 text-white p-4 mb-4 shadow-md">
    <h3>{peanut.avg_overall.toFixed(2) || '-'} {star.repeat(parseInt(peanut.avg_overall))}</h3>
    <li><a class="text-green-500 hover:underline" href={`/${peanut.id}`}>{peanut.resto_name}: "{peanut.product}"{peanut.price ? ` - $${peanut.price.toFixed(2)}` : ''}</a></li>
    <ul>
      <li>Submitted: {new Date(peanut.created_at).toLocaleDateString()}</li>
      <!-- <li>Location: {peanut?.y}, {peanut?.x}</li> -->
    </ul><br>
    </div>
    {/each}

    <!-- Display the error message if there is one -->
    {#if data.error}
    <p style="color: red;">Error: {data.error}</p>
    {/if}
  </ol>

  <MapLibre
  class="w-full h-80 lg:h-200 lg:w-2/3 flex-none rounded-lg shadow-lg"
  // center={[-84.3880, 33.7490]}
  bounds={mapBounds}
  fitBoundsOptions={{ padding: 125 }}
  zoom={5}
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
          Overall Rating: {peanut.avg_overall}
          <!-- Submitted: {new Date(peanut.created_at).toLocaleDateString()} -->
        </div>
      </Popup>
    </Marker>
    {/each}
  </MapLibre>

</main>

<!-- <style lang="postcss">
@reference "tailwindcss";

 </style> -->