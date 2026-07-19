<script>
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Peanut from '$lib/Peanut.svelte';

// export let data;
let { data } = $props();
let mapZoom = $state(5);
const CLUSTER_CELL_SIZE = 64;
const CLUSTER_ZOOM_STEP = 1;

const validPeanuts = $derived(data.peanuts?.filter((p) => p.x !== null && p.y !== null) ?? []);

function projectToPixel(lon, lat, zoom) {
  const scale = 256 * Math.pow(2, zoom);
  const x = ((lon + 180) / 360) * scale;

  const clampedLat = Math.max(-85.05112878, Math.min(85.05112878, lat));
  const latRad = (clampedLat * Math.PI) / 180;
  const y =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * scale;

  return { x, y };
}

function clusterPeanuts(peanuts, zoomBucket) {
  if (!peanuts.length) {
    return [];
  }

  const buckets = new Map();

  for (const peanut of peanuts) {
    const pixel = projectToPixel(peanut.x, peanut.y, zoomBucket);
    const key = `${Math.floor(pixel.x / CLUSTER_CELL_SIZE)}:${Math.floor(pixel.y / CLUSTER_CELL_SIZE)}`;
    const existing = buckets.get(key);

    if (!existing) {
      buckets.set(key, {
        key,
        peanuts: [peanut],
        lonSum: peanut.x,
        latSum: peanut.y,
        avgOverallSum: peanut.avg_overall ?? 0,
        ratedCount: peanut.avg_overall == null ? 0 : 1
      });
      continue;
    }

    existing.peanuts.push(peanut);
    existing.lonSum += peanut.x;
    existing.latSum += peanut.y;
    existing.avgOverallSum += peanut.avg_overall ?? 0;
    if (peanut.avg_overall != null) {
      existing.ratedCount += 1;
    }
  }

  return Array.from(buckets.values()).map((bucket) => {
    const sortedIds = bucket.peanuts
      .map((peanut) => peanut.id)
      .sort((a, b) => String(a).localeCompare(String(b)));

    const count = bucket.peanuts.length;

    return {
      key: bucket.key,
      count,
      lnglat: [bucket.lonSum / count, bucket.latSum / count],
      peanuts: bucket.peanuts,
      avgOverall: bucket.ratedCount > 0 ? bucket.avgOverallSum / bucket.ratedCount : null,
      renderKey:
        count === 1
          ? `single:${sortedIds[0]}`
          : `cluster:${zoomBucket}:${sortedIds.join('-')}`
    };
  });
}

const clusterZoom = $derived(Math.round(mapZoom / CLUSTER_ZOOM_STEP) * CLUSTER_ZOOM_STEP);
const clusteredPeanuts = $derived(clusterPeanuts(validPeanuts, clusterZoom));

// $inspect(data);

let mapBounds = $derived.by(() => {
  if (!data.peanuts?.length) return undefined;
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
        <Peanut size={20} clipHeight={0} strokeHex="#333333" fillHex="#000000" />
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
  bind:zoom={mapZoom}
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" >

  {#each clusteredPeanuts as cluster (cluster.renderKey)}
    {#if cluster.count === 1}
    {@const peanut = cluster.peanuts[0]}
    <Marker lnglat={cluster.lnglat} anchor="bottom">
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
    {:else}
    <Marker lnglat={cluster.lnglat} anchor="center">
      {#snippet content()}
        <button type="button" class="cluster-pin" aria-label={`${cluster.count} peanuts in this area`}>
          {cluster.count}
        </button>
      {/snippet}
      <Popup openOn="click" offset={[0, -10]}>
        <div class="bg-gray-600/90 text-white" style="padding: 8px; border-radius: 8px; border: 1px solid black;">
          <strong>{cluster.count} peanuts nearby</strong><br>
          {#if cluster.avgOverall != null}
            Avg rating in cluster: <b>{cluster.avgOverall.toFixed(1)}</b><br>
          {/if}
          Zoom in to view individual peanuts.
        </div>
      </Popup>
    </Marker>
    {/if}
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

  :global(.maplibregl-popup-anchor-top .maplibregl-popup-tip),
  :global(.maplibregl-popup-anchor-top-left .maplibregl-popup-tip),
  :global(.maplibregl-popup-anchor-top-right .maplibregl-popup-tip) {
    border-color: transparent transparent #4a5565 transparent !important; /* Tailwind's gray-600 */
  }

  :global(.maplibregl-popup-anchor-bottom .maplibregl-popup-tip),
  :global(.maplibregl-popup-anchor-bottom-left .maplibregl-popup-tip),
  :global(.maplibregl-popup-anchor-bottom-right .maplibregl-popup-tip) {
    border-color: #4a5565 transparent transparent transparent !important; /* Tailwind's gray-600 */
  }

  :global(.maplibregl-popup-anchor-left .maplibregl-popup-tip) {
    border-color: transparent #4a5565 transparent transparent !important; /* Tailwind's gray-600 */
  }

  :global(.maplibregl-popup-anchor-right .maplibregl-popup-tip) {
    border-color: transparent transparent transparent #4a5565 !important; /* Tailwind's gray-600 */
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

  .cluster-pin {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    min-height: 2rem;
    padding: 0.15rem 0.55rem;
    border-radius: 9999px;
    border: 2px solid #00c951;
    background: #f8f5e9;
    color: #1f2937;
    font-weight: 800;
    box-shadow: 0 4px 10px rgb(0 0 0 / 0.35);
    cursor: pointer;
  }

  a:hover {
    text-decoration: underline;
  }
 </style>