<script>
import Loader from '$lib/Loader.svelte';
import { onMount } from 'svelte';
import { enhance } from "$app/forms";
import { MapLibre, Marker } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

let { data, form } = $props();
let isLoading = $state(false);
let coords = $state({ lat: null, lon: null });
let geoStatus = $state('-');

$inspect(coords)

// Address search
  function URLencode(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  };

function addySearch() {
    isLoading = true;
    // Get the location of the user and put address in the input field
    if (address.value == '') {
      geoStatus = 'Please enter an address';
      isLoading = false;
      return;
    }
    let addressEncoded = URLencode(address.value);
    // console.log(addressEncoded);
    let uriToFetch = `https://gis.atlantaga.gov/dpcd/rest/services/SiteAddressPoint/GeocodeServer/findAddressCandidates?Address=${addressEncoded}&City=Atlanta&matchOutOfRange=true&outSR=4326&f=pjson`;

    fetch(uriToFetch)
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.candidates[0]) {
            // console.log(latitude, longitude);
            geoStatus = 'Location found!';
            coords.lat = data.candidates[0]?.location.y;
            coords.lon = data.candidates[0]?.location.x;
        //   document.getElementById('geopoint_lat').value = latitude;
        //   document.getElementById('geopoint_lon').value = longitude;
          //   placeName = data.candidates[0].address.toUpperCase();
          // data[0].display_name.replace(/, Atlanta.*/gis, '');
          //   getNPU(latitude, longitude).catch((e) => console.error(e));
          isLoading = false;
        } else {
          geoStatus = 'Not found.. Example: 123 Peachtree St NE';
          //   results.innerText = '🤔';
          //   npuLink.removeAttribute('href');
          isLoading = false;
        }
      });
  }

// Find the user by GPS
function geoLocate() {
    console.log('Geolocating!')
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

        // document.getElementById('geopoint_lat').value = latitude;
        // document.getElementById('geopoint_lon').value = longitude;

        // coords = { latitude, longitude };
        isLoading = false;
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
            <label for="address">Restaurant Address:</label><br>
            <input type="text" id="address" name="address" placeholder="1600 Peanutsvania Avenue" required>

            <button
        onclick={(e) => {e.preventDefault(); addySearch()}}
        class="rounded-full bg-yellow-500 p-2 m-2"
        >Address Search</button>
</div>

        <div>
            <h4> -- OR --</h4>
        </div>

        <div>
            <button
        onclick={(e) => {e.preventDefault(); geoLocate()}}
        class="rounded-full bg-green-500 p-2 m-2"
        id="locate"
        >Locate Me</button>
        <span>{geoStatus}</span>
        <br><br>

        <div class="geopoint-container w-100">
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

            {#if isLoading}
            <Loader />
            {/if}

            <div>
            <!-- HERE'S THE MAP 🗺️ -->
            <!-- TODO: Adjust map center and zoom when Peanut is updated. -->
                <MapLibre
                class="h-60 w-80"
                center={[-84.378, 33.748]}
                zoom={10}
                style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                >

                {#if coords.lat !== null}
                <Marker lnglat={[ coords.lon, coords.lat ]} anchor="bottom">
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
    <input class="rounded-full bg-green-500 p-2 m-2" type="submit" value="Submit">
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
        margin-bottom: 15px;
        border: 1px solid whitesmoke;
        background-color: whitesmoke;
        border-radius: 4px;
    }

    button, input[type="submit"] {
        padding: 10px;
        /* background-color: #4CAF50; */
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover, input[type="submit"]:hover {
        background-color: #45a049;
    }

    /* .geopoint-container {
        display: flex;
        justify-content: flex-start;
    } */
</style>