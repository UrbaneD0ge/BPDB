<script>
import Loader from '$lib/Loader.svelte';
import { onMount } from 'svelte';
import { enhance } from "$app/forms";
import { MapLibre, Marker } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

let { data, form } = $props();
let {addyLoading, geoLoading} = $state(true);
let coords = $state({ lat: 35, lon: -88 });
let geoStatus = $state('');
let zoom = $state(2);

// $inspect(coords)

// Address search
  function URLencode(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  };

async function reverseGC(coords) {
    if (!coords || coords.lat == null || coords.lon == null) {
        geoStatus = 'No coordinates to reverse geocode';
        return;
    }

    geoLoading = true;
    geoStatus = 'Finding your peanuts...';

    try {
        const reverseAPI = `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json`;
        console.log(reverseAPI);
        const response = await fetch(reverseAPI, { headers: { 'Accept': 'application/json' } });
        const data = await response.json();
        console.log(data);
        if (data && data.display_name) {
            geoStatus = 'Address found';
            zoom = 15;
            // populate address input if present
            if (typeof address !== 'undefined' && address) address.value = data.address.house_number + ' ' + data.address.road;
        } else {
            geoStatus = 'No address found for these coordinates';
        }
    } catch (e) {
        console.error(e);
        geoStatus = 'Reverse geocoding failed';
    } finally {
        geoLoading = false;
    }
}

function addySearch() {
    addyLoading = true;
    // Get the location of the user and put address in the input field
    if (address.value == '') {
      geoStatus = 'Please enter an address';
      addyLoading = false;
      return;
    }
    let addressEncoded = encodeURIComponent(address.value);
    // console.log(addressEncoded);
    // let uriToFetch = `https://gis.atlantaga.gov/dpcd/rest/services/SiteAddressPoint/GeocodeServer/findAddressCandidates?Address=${addressEncoded}&City=Atlanta&matchOutOfRange=true&outSR=4326&f=pjson`;
    let uriToFetch = `https://nominatim.openstreetmap.org/search?q=${addressEncoded}&format=json`;

    fetch(uriToFetch)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
            // console.log(latitude, longitude);
            geoStatus = 'Location found!';
            zoom = 15;
            coords.lat = data[0].lat;
            coords.lon = data[0].lon;
            addyLoading = false;
        } else {
          geoStatus = 'Not found.. Example: 123 Peachtree St NE';
          addyLoading = false;
        }
      });
  }

// Find the user by GPS
function geoLocate() {
    console.log('Geolocating!')
    geoLoading = true;
    geoStatus = 'Using your device location...'
    // Get the location of the user and put address in the input field
    if (!navigator.geolocation) {
        geoStatus = 'Geolocation is not supported by your browser';
        return;
    }

    function success(position) {
        coords.lat = position.coords.latitude;
        coords.lon = position.coords.longitude;
        // coords.lat = latitude;
        // coords.lon = longitude;
        // console.log(latitude, longitude);
        geoStatus =
        'Location found: ' + coords.lat.toFixed(2) + ', ' + coords.lon.toFixed(2);

        reverseGC(coords);

        // coords = { latitude, longitude };
        geoLoading = false;
        // return latitude, longitude;
    }

    function error() {
        geoStatus = 'Unable to retrieve your location';
    }

    navigator.geolocation.getCurrentPosition(success, error);
    return;
};

</script>


<h1>Submit a new BP to the DB!</h1>
<p>Use the form below to submit a new boiled peanut entry to the database. Please include the restaurant name and location, product name and price.</p>

<form method="POST"use:enhance>
    <label for="resto_name">Restaurant Name:</label><br>
    <input type="text" id="resto_name" name="resto_name" placeholder="Jimmy's Peanut Shack" required><br><br>

    <label for="product">Product Name:</label><br>
    <input type="text" id="product" name="product_name" placeholder="Boiled Peanut item as it appears on the menu" required><br><br>

    <label for="price">Menu Price:</label><br>
    <input type="number" min="0.00" step="0.01" id="price" name="price" placeholder="4.50" required><br><br>

    <!-- 🛰️ !! GEOLOCATION BLOCK !! 📍 -->
    <fieldset class="bg-stone-300 rounded-lg p-2">

        <div>
            <!-- TODO: This should be an address picker eventually -->
            <label for="address">Restaurant Address:</label>



                <input type="text" id="address" name="address" placeholder="1600 Peanutsvania Avenue" required>

                <button
                onclick={(e) => {e.preventDefault(); addySearch()}}
                class="rounded-full bg-yellow-500 p-2 m-2"
                >{#if addyLoading}
                    <Loader />
                    {:else}
                    Address Search
                    {/if}
                </button>

        </div>


                    <!-- LOCATE ME FUNCTIONS/ELEMENTS -->
        <div class="w-full geopoint-container flex flex-col-reverse lg:flex-row-reverse justify-between items-center">

                <div hidden>
                    <!-- GEOPOINT INPUT BOXES ARE HIDDEN -->
                    <div>
                        <label for="geopoint_lat">Latitude:</label>
                        <!-- <div>{coords.lat?.toFixed(3)}</div> -->
                        <input type="text" id="geopoint_lat" name="latitude" value={coords.lat} required>
                    </div>

                    <div>
                        <label for="geopoint_lon">Longitude:</label>
                        <!-- <div>{coords.lon?.toFixed(3)}</div> -->
                        <input type="text" id="geopoint_lon" name="longitude" value={coords.lon} required>
                    </div>

                </div>

                <!-- BUTTON AND LOADER -->
                        <button
                        onclick={(e) => {e.preventDefault(); geoLocate()}}
                        class="rounded-full bg-green-500 lg:p-2 lg:m-2"
                        id="locate"
                        >{#if geoLoading}
            <Loader />
        {:else}
        Locate Me
        {/if}</button>

                <!-- GEOSTATUS AND MAP -->
                    <div class="flex flex-col lg:flex-row-reverse items-center justify-end w-full lg:w-2/3 gap-4">

                        <span class="p-2">{geoStatus}</span>

                        <div>
                        <!-- HERE'S THE MAP 🗺️ -->
                        <!-- TODO: Adjust map center and zoom when Peanut is updated. -->
                            <MapLibre
                            class="h-80 w-90 rounded-lg"
                            center={[coords.lon, coords.lat]}
                            zoom={zoom}
                            style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                            >

                            {#if coords.lat === 35 && coords.lon === -88}
                                <div class="text-3xl">📍</div>
                            {:else}
                            <Marker lnglat={([ coords.lon, coords.lat ])} anchor="bottom">
                                {#snippet content()}
                                <div class="text-3xl">🥜</div>
                                {/snippet}
                            </Marker>
                            {/if}

                            </MapLibre>
                </div>
            </div>
        </div>
    </fieldset>

    {#if form?.error}
        <p class="error-message">{form.error}</p>
    {/if}
<br><br>
    <button class="text-xl font-rounded-extrabold bg-green-500 p-2" type="submit" value="Submit">Submit Peanut!</button>
    {#if data?.error}
        <p style="color: red;">{data.error}{data?.message}</p>
    {/if}
</form>

<style>
    form {
        display: flex;
        flex-direction: column;
    }

    label {
        font-weight: bold;
        width: 25%;
    }

    input[type="number"] {
        background-color: whitesmoke;
        border: 1px solid whitesmoke;
        padding: 8px;
        border-radius: 4px;
    }

    input[type="text"] {
        padding: 8px;
        border: 1px solid whitesmoke;
        background-color: whitesmoke;
        border-radius: 4px;
    }

    button {
        padding: 10px;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

</style>