<h1>Welcome to the BPDB</h1>
<p>Boiled Peanut DataBase</p>

<!-- <script>
  import { MapLibre } from 'svelte-maplibre';
  import DefaultMarker from 'svelte-maplibre/DefaultMarker.svelte';
  import Popup from 'svelte-maplibre/Popup.svelte';
</script> -->

<script>
  export let data;
</script>

<ol>
  {#each data.peanuts as peanut}
    <li><b>{peanut.resto_name}</b>: {peanut.product}</li>
  <ul>
    <li>ID: {peanut.id}</li>
    <li>Submitted: {new Date(peanut.created_at).toLocaleDateString()}</li>
    <li>Location: {peanut?.geopoint}</li>
    <li>Geo X: {peanut?.geo_X}</li>
    <li>Geo Y: {peanut?.geo_Y}</li>
  </ul>
  {/each}

  <!-- Display the error message if there is one -->
  {#if data.error}
    <p style="color: red;">Error: {data.error}</p>
  {/if}
</ol>