<script>
import { onMount } from 'svelte';
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
  import Peanut from '$lib/Peanut.svelte';

// export let data;
let { data } = $props();

// $inspect(data);

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

<h1 class="mx-2 text-3xl!">BPDB: The Boiled Peanut DataBase</h1>
<main class="flex flex-col-reverse lg:flex-row justify-between lg:items-center lg:pt-0 mt-2 mx-2 gap-4 lg:mr-4 font-rounded-regular">

  <ol class="flex flex-col w-full lg:w-1/3 lg:h-[90svh] overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600">
    {#if !data.peanuts?.length}
      <p class="text-white">No peanuts found. Be the first to submit one!</p>
    {/if}

    {#each data.peanuts as peanut (peanut.id)}

    <!-- RATING CARD -->
    <div class="flex flex-row border border-gray-600 bg-gray-600 inset-shadow-sm/25 rounded-lg text-white p-2 mb-4 gap-4">
      <div class="flex flex-col items-center justify-center w-30">
        <Peanut size={20} clipHeight={(peanut?.avg_overall * 10)}  />
        <h3 class="text-3xl font-rounded-extrabold">{peanut?.avg_overall?.toFixed(1) || '-'}</h3>
        <!-- <h4>{star.repeat(parseInt(peanut.avg_overall))}</h4> -->
      </div>

      <div>
        <ul>
          <li><a class="text-green-500 hover:underline text-xl" href={`/${peanut.id}`}>{peanut.resto_name}<br>"{peanut.product}"</a></li>
          <li>{peanut.price ? `$${peanut.price.toFixed(2)}` : '  -  '}</li>
          <li><b>{peanut?.review_count}</b> reviews so far..</li>
          <li class="font-rounded-light">Submitted: {new Date(peanut.created_at).toLocaleDateString()}</li>
          <!-- <li>Location: {peanut?.y}, {peanut?.x}</li> -->
        </ul><br>
      </div>
    </div>
    {/each}
    <div class="flex flex-row border border-gray-600 bg-gray-600 inset-shadow-sm/25 rounded-lg text-white p-2 mb-4 gap-4">
      <div class="flex flex-col items-center justify-center w-30">
        <Peanut size={20} clipHeight={100} strokeHex="#333333" fillHex="#000000" />
        <h3 class="text-3xl font-rounded-extrabold">???</h3>
      </div>

      <div class="flex flex-col justify-center">
        <li><a class="text-green-500 hover:underline text-xl" href={data.session? '/submit' : '/auth/signup'}>Submit a Peanut</a></li>
        <ul>
        <li>Your Peanut Goes HERE!</li>
        </ul><br>
      </div>
    </div>

    <!-- Display the error message if there is one -->
    {#if data.error}
    <p style="color: red;">Error: {data.error}</p>
    {/if}
  </ol>

  <MapLibre
  class="h-80 lg:h-[90svh] lg:w-2/3 flex-none rounded-lg shadow-lg"
  // center={[-84.3880, 33.7490]}
  bounds={mapBounds}
  fitBoundsOptions={{ padding: 125 }}
  zoom={5}
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" >

  {#each data.peanuts as peanut}
    <Marker lnglat={[peanut.x, peanut.y]} anchor="bottom">
        {#snippet content()}
          <Peanut size={13} clipHeight={peanut?.avg_overall * 10} disableHoverEffects={true} />
        {/snippet}
      <Popup openOn="click" offset={[0, -40]}>
        <div class="bg-gray-600/90 text-white" style="padding: 5px; border-radius: 8px; border: 1px solid black;">
          <a href={`/${peanut.id}`}><strong>{peanut.resto_name}</strong><br>
          "{peanut.product}"<br></a>
          Overall Rating: <b>{peanut.avg_overall?.toFixed(1) || '-'}</b> ({peanut?.review_count})<br>
          <!-- Submitted: {new Date(peanut.created_at).toLocaleDateString()} -->
        </div>
      </Popup>
    </Marker>
    {/each}
  </MapLibre>

</main>

<style lang="postcss">
@reference "tailwindcss";

/* Ensure the font utility used in markup resolves to a real global class. */
  :global(.font-rounded-light) {
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-weight: 300;
  font-style: normal;
  }

  :global(.font-rounded-regular) {
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-weight: 400;
  font-style: normal;
  }

  :global(.font-rounded-extrabold) {
  font-family: "M PLUS Rounded 1c", sans-serif;
  font-weight: 800;
  font-style: normal;
  }

  /* :global(.maplibregl-canvas) {
    margin-bottom: 20px;
  } */

  :global(.maplibregl-popup-content) {
    font-family: "M PLUS Rounded 1c", sans-serif;
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

  :global(.maplibregl-popup-close-button:focus) {
    border: none !important;
    outline: none !important;
  }

  :global(.maplibregl-popup-close-button:hover) {
    background-color: transparent !important;
  }

  a:hover {
    text-decoration: underline;
  }
 </style>