<script>
import Loader from '$lib/Loader.svelte';
// import { onMount } from 'svelte';
import { enhance } from "$app/forms";
import { MapLibre, Marker, Popup } from 'svelte-maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
  import Peanut from '$lib/Peanut.svelte';

let { data, form } = $props();
let streetAddress = $state('');
let addressInput = $state('');
let restaurantName = $state('');
let productName = $state('');
let priceInput = $state('');
let rawValue = $state('');
let displayValue = $state('');
let formState = $state(null);
let addyLoading = $state(false);
let geoLoading = $state(false);
let coords = $state({ lat: 35, lon: -88 });
let geoStatus = $state('');
let zoom = $state(2);
const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});
const markerCenterOffsetLat = 0.00125;
const hasMarker = $derived(coords.lat !== 35 || coords.lon !== -88);
const mapCenter = $derived([
    Number(coords.lon),
    Number(coords.lat) + (hasMarker ? markerCenterOffsetLat : 0)
]);

$effect(() => {
    formState = form ?? null;
    addressInput = form?.data?.address ?? '';
    restaurantName = form?.data?.resto_name ?? '';
    productName = form?.data?.product_name ?? '';

    const incomingPrice = form?.data?.price ?? '';
    if (incomingPrice === '') {
        rawValue = '';
        displayValue = '';
        priceInput = '';
    } else {
        const numericPrice = Number(String(incomingPrice).replace(/,/g, ''));
        if (Number.isFinite(numericPrice)) {
            rawValue = Math.round(numericPrice * 100).toString().slice(0, 12);
            const normalized = Number(rawValue) / 100;
            displayValue = formatter.format(normalized);
            priceInput = normalized.toFixed(2);
        } else {
            rawValue = '';
            displayValue = '';
            priceInput = '';
        }
    }
});

$inspect(form, 'formdata');
// $inspect(geoLoading, 'geoLoading');

function handleInput(e) {
    const input = e.target.value;
    const digits = input.replace(/\D/g, '');

    if (digits === '') {
        rawValue = '';
        displayValue = '';
        priceInput = '';
        return;
    }

    rawValue = digits.slice(0, 12);
    const numericValue = Number(rawValue) / 100;
    displayValue = formatter.format(numericValue);
    priceInput = numericValue.toFixed(2);
}

function handleKeyDown(e) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
        return;
    }

    if (isNaN(Number(e.key))) {
        e.preventDefault();
    }
}



// Clear form
function clearForm() {
    formState = null;
    addressInput = '';
    restaurantName = '';
    productName = '';
    priceInput = '';
    rawValue = '';
    displayValue = '';
    streetAddress = '';
    coords = { lat: 35, lon: -88 };
    geoStatus = '';
    zoom = 2;
    addyLoading = false;
    geoLoading = false;
}

function enhanceSubmit() {
    return async ({ result, update }) => {
        await update();

        if (result.type === 'failure') {
            formState = result.data;
        }
    };
}

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
            streetAddress = `${data.address.house_number || ''} ${data.address.road || ''}, ${data.address.city || data.address.town || data.address.village || ''}, ${data.address.state || ''} ${data.address.postcode || ''}`;
            addressInput = streetAddress;
            zoom = 15;
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
        if (addressInput == '') {
      geoStatus = 'Please enter an address';
      addyLoading = false;
      return;
    }

        let addressEncoded = encodeURIComponent(addressInput);
    // console.log(addressEncoded);

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
            streetAddress = `${data[0].address?.house_number || ''} ${data[0].address?.road || ''}, ${data[0].address?.city || ''}, ${data[0].address?.state || ''} ${data[0].address?.postcode || ''}`;
            addressInput = streetAddress;
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
    addressInput = '';
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
<form method="POST" class="my-6! lg:my-12!" use:enhance={enhanceSubmit}>

    <h1 class="text-white">Submit a new BP to the DB</h1>
    <p class="text-white">Use the form below to submit a new boiled peanut entry to the database. Please include the restaurant name and location, product name and price.</p><br>

    <!-- 🛰️ !! GEOLOCATION BLOCK !! 📍 -->
    <fieldset class="bg-stone-300 rounded-lg p-2">

        <div>

            <!-- TODO: This should be an address picker eventually -->
            <label for="address">Restaurant Search: <span class="error-message italic">{formState?.fieldErrors?.fieldErrors?.address}</span></label>

            <div class="flex flex-col lg:flex-row justify-between items-center gap-2">

                <input type="text" id="address" name="address" autocomplete="off" placeholder="Name or Address" bind:value={addressInput} >

                <button
                onclick={(e) => {e.preventDefault(); addySearch()}}
                class="rounded-full bg-yellow-500 text-nowrap p-2 m-2 action-button address-button w-full lg:w-auto"
                >{#if addyLoading}
                    <Loader fillHex="#FFD700" strokeHex="#FFA500"  />
                    {:else}
                    Search
                    {/if}
                </button>
            </div>

            <label for="resto_name">Restaurant Name: <span class="error-message italic">{formState?.fieldErrors?.fieldErrors?.resto_name}</span></label>

            <div class="flex flex-col lg:flex-row justify-between items-center gap-2">

                <input type="text" id="resto_name" name="resto_name" placeholder="Jimmy's Peanut Shack" bind:value={restaurantName}>

                <button type="button" onclick={clearForm} class="rounded-full bg-red-500 text-nowrap p-2 m-2 action-button address-button w-full lg:w-auto">Clear All</button>

            </div>

        </div>


                        <!-- <span class="p-2">{geoStatus}</span> -->
                        <span class="error-message italic">{formState?.fieldErrors?.fieldErrors?.geopoint}</span>

                    <!-- LOCATE ME FUNCTIONS/ELEMENTS -->
        <div class="w-full geopoint-container flex flex-col-reverse lg:flex-row-reverse justify-between items-center gap-2 lg:gap-4">

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
                        class="rounded-full bg-green-500 lg:p-2 lg:m-2 action-button locate-button w-full lg:w-auto"
                        id="locate"
                        >
                    {#if geoLoading}
                        <Loader fillHex="#FFD700" strokeHex="#FFA500" />
                    {:else}
                    Locate Me
                    {/if}</button>

                <!-- GEOSTATUS AND MAP -->
                    <div class="flex flex-col md:flex-row-reverse items-center justify-end w-full md:w-2/3 gap-4">

                        <!-- <div> -->
                        <!-- HERE'S THE MAP 🗺️ -->
                        <!-- TODO: Adjust map center and zoom when Peanut is updated. -->
                            <MapLibre
                            class="h-80 w-80 lg:w-90 rounded-lg"
                            center={mapCenter}
                            zoom={zoom}
                            attributionControl={false}
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
                                        <h1>{restaurantName}</h1>
                                        <h6>{streetAddress}</h6>
                                        </div>
                                    </Popup>
                            </Marker>
                            {/if}

                            </MapLibre>
                </div>
            </div>
        <!-- </div> -->
    </fieldset>

    <label for="product">Product Name: <span class="error-message italic">{formState?.fieldErrors?.fieldErrors?.product_name}</span></label>
    <input type="text" id="product" name="product_name" placeholder="Boiled Peanut item as it appears on the menu" bind:value={productName} >

    <label for="price">Menu Price: <span class="error-message italic">{formState?.fieldErrors?.fieldErrors?.price}</span></label>
    <input
        type="text"
        inputmode="numeric"
        id="price"
        placeholder="0.00"
        bind:value={displayValue}
        oninput={handleInput}
        onkeydown={handleKeyDown}
    >
    <input type="hidden" name="price" value={priceInput} ><br>


    {#if formState?.error}
        <p class="error-message">{formState.error}</p>
    {/if}

    <button class="text-xl font-rounded-extrabold bg-green-500 p-2 w-full lg:w-auto" type="submit" value="Submit">Submit Peanut!</button>
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

    input[type="text"] {
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