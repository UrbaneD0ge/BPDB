<script>
import Loader from '$lib/Loader.svelte';
import { onMount } from 'svelte';
import { enhance } from "$app/forms";
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
  import Peanut from '$lib/Peanut.svelte';

let { data, form } = $props();
let streetAddress = $state('');
let restaurantName = $state('');
let addyLoading = $state(false);
let geoLoading = $state(false);
let coords = $state({ lat: 35, lon: -88 });
let geoStatus = $state('');
let zoom = $state(2);
const markerCenterOffsetLat = 0.00125;
const hasMarker = $derived(coords.lat !== 35 || coords.lon !== -88);
const mapCenter = $derived([
    Number(coords.lon),
    Number(coords.lat) + (hasMarker ? markerCenterOffsetLat : 0)
]);

// $inspect(addyLoading, 'addyLoading');
// $inspect(geoLoading, 'geoLoading');

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
        // console.log(reverseAPI);
        const response = await fetch(reverseAPI, { headers: { 'Accept': 'application/json' } });
        const data = await response.json();
        console.log('Reverse: ', data);
        if (data && data.display_name) {
            geoStatus = 'Address found: ' + data.name;
            restaurantName = data.name;
            streetAddress = data.address.house_number + ' ' + data.address.road;
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
    let uriToFetch = `https://nominatim.openstreetmap.org/search?q=${addressEncoded}&format=json&addressdetails=1&limit=1`;

    fetch(uriToFetch)
      .then((response) => response.json())
      .then((data) => {
        console.log('Addydata: ', data);
        if (data.length > 0) {
            // console.log(latitude, longitude);
            geoStatus = 'Location found!';
            zoom = 15;
            coords.lat = Number(data[0].lat);
            coords.lon = Number(data[0].lon);
            restaurantName = data[0].name;
            streetAddress = data[0].address.house_number + ' ' + data[0].address.road + ', ' + data[0].address.city + ', ' + data[0].address.state + ' ' + data[0].address.postcode;
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
    address.value = '';
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

<svelte:head>
    <title>Submit a Peanut</title>
</svelte:head>

<main class="px-2 lg:pt-8">
<form method="POST" class="my-6! lg:my-12!" use:enhance>

    <h1 class="text-white">Submit a new BP to the DB</h1>
    <p class="text-white">Use the form below to submit a new boiled peanut entry to the database. Please include the restaurant name and location, product name and price.</p><br>

    <label for="product">Product Name: <span class="error-message italic">{form?.fieldErrors?.fieldErrors?.product_name}</span></label>
    <input type="text" id="product" name="product_name" placeholder="Boiled Peanut item as it appears on the menu" value={form?.data?.product_name} ><br>

    <label for="price">Menu Price: <span class="error-message italic">{form?.fieldErrors?.fieldErrors?.price}</span></label>
    <input type="tel" pattern="[0-9]+(\.[0-9]{1,2})?" id="price" name="price" placeholder="4.50" value={form?.data?.price} ><br>

    <!-- 🛰️ !! GEOLOCATION BLOCK !! 📍 -->
    <fieldset class="bg-stone-300 rounded-lg p-2">

        <div>

            <label for="resto_name">Restaurant Name: <span class="error-message italic">{form?.fieldErrors?.fieldErrors?.resto_name}</span></label>
            <input type="text" id="resto_name" name="resto_name" placeholder="Jimmy's Peanut Shack" value={form?.data?.resto_name}>

            <br>

            <!-- TODO: This should be an address picker eventually -->
            <label for="address">Restaurant Address: <span class="error-message italic">{form?.fieldErrors?.fieldErrors?.address}</span></label>

                <div class="flex flex-row justify-between items-center gap-2">
                <input type="text" id="address" name="address" autocomplete="off" placeholder="Name or Address" value={form?.data?.address} >

                <button
                onclick={(e) => {e.preventDefault(); addySearch()}}
                class="rounded-full bg-yellow-500 text-nowrap p-2 m-2 action-button address-button"
                >{#if addyLoading}
                    <Loader fillHex="#FFD700" strokeHex="#FFA500"  />
                    {:else}
                    Address Search
                    {/if}
                </button>
                </div>
        </div>


                    <!-- LOCATE ME FUNCTIONS/ELEMENTS -->
        <div class="w-full geopoint-container flex flex-col-reverse lg:flex-row-reverse justify-between items-center">

                <div hidden>
                    <!-- GEOPOINT INPUT BOXES ARE HIDDEN -->
                    <div>
                        <!-- <div>{coords.lat?.toFixed(3)}</div> -->
                        <label for="geopoint_lat">Latitude:</label>
                        <input type="hidden" id="geopoint_lat" name="latitude" value={coords.lat}>
                    </div>

                    <div>
                        <!-- <div>{coords.lon?.toFixed(3)}</div> -->
                        <label for="geopoint_lon">Longitude:</label>
                        <input type="hidden" id="geopoint_lon" name="longitude" value={coords.lon}>
                    </div>

                </div>

                <!-- BUTTON AND LOADER -->
                        <button
                        onclick={(e) => {e.preventDefault(); geoLocate()}}
                        class="rounded-full bg-green-500 lg:p-2 lg:m-2 action-button locate-button"
                        id="locate"
                        >
                    {#if geoLoading}
                        <Loader fillHex="#FFD700" strokeHex="#FFA500" />
                    {:else}
                    Locate Me
                    {/if}</button>

                <!-- GEOSTATUS AND MAP -->
                    <div class="flex flex-col md:flex-row-reverse items-center justify-end w-full md:w-2/3 gap-4">

                        <span class="p-2">{geoStatus}</span>
                        <span class="error-message italic">{form?.fieldErrors?.fieldErrors?.geopoint}</span>

                        <div>
                        <!-- HERE'S THE MAP 🗺️ -->
                        <!-- TODO: Adjust map center and zoom when Peanut is updated. -->
                            <MapLibre
                            class="h-80 w-80 lg:w-90 rounded-lg"
                            center={mapCenter}
                            zoom={zoom}
                            style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                            >

                            {#if coords.lat === 35 && coords.lon === -88}
                                <div class="text-3xl">📍</div>
                            {:else}
                            <Marker lnglat={([ coords.lon, coords.lat ])} anchor="bottom">
                                {#snippet content()}
                                <!-- <div class="text-3xl">🥜</div> -->
                                <Peanut id="peanut-marker" size={10} clipHeight={100} disableHoverEffects={true} />
                                {/snippet}
                                      <Popup open offset={[0, -40]}>
                                        <div class="bg-gray-600/90 text-white popup" style="padding: 5px; border-radius: 8px; border: 1px solid black;">
                                        <h1>NAME: {restaurantName}</h1>
                                        <h6>Address: {streetAddress}</h6>
                                        </div>
                                    </Popup>
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
<br>
    <button class="text-xl font-rounded-extrabold bg-green-500 p-2" type="submit" value="Submit">Submit Peanut!</button>
    {#if data?.error}
        <p style="color: red;">{data.error}{data?.message}</p>
    {/if}
</form>
</main>

<style>
    form {
        display: flex;
        flex-direction: column;
    }

    label {
        font-weight: bold;
    }

    input[type="tel"] {
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

    .popup {
        font-size: 0.9rem;
    }

    .error-message {
    color: #af1d1d;
    font-size: 1.2rem;
    margin-top: 0.25rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    font-weight: normal;
}

    .action-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 2.75rem;
    }

    .address-button {
        min-width: 10.5rem;
    }

    .locate-button {
        min-width: 7.5rem;
    }

</style>