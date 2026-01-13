<h1>Welcome to the BPDB</h1>
<p>Boiled Peanut DataBase</p>

<script>
  import { MapLibre } from 'svelte-maplibre';
  import DefaultMarker from 'svelte-maplibre/DefaultMarker.svelte';
  import Popup from 'svelte-maplibre/Popup.svelte';
</script>

<MapLibre 
  center={[-84.38, 33.7506]}
  zoom={7}
  class="map"
  standardControls
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json">
    
    <DefaultMarker lngLat={[-84.38, 33.7506]}>
        <Popup offset={[0, -10]}>
            <div>Atlanta, GA</div>
        </Popup>
    </DefaultMarker>
    
</MapLibre>

<style>
  :global(.map) {
    height: 500px;
  }
</style>