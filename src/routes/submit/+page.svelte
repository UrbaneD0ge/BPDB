<script>
import Loader from '$lib/Loader.svelte';
import { onMount } from 'svelte';

let data;
let isLoading = $state(true);
let coords = $state({ lat: null, lon: null });

onMount(() => {
    // get geolocation and fill in the geopoint field
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById('geopoint_lat').value = lat;
            document.getElementById('geopoint_lon').value = lon;
            coords = { lat, lon };
            isLoading = false;
        });
        console.log('Geolocation found.');
    } else {
        console.warn('Geolocation is not supported by this browser.');
        isLoading = false;
    }
});
</script>


<h1>Submit a new BP to the DB!</h1>
<p>Use the form below to submit a new boiled peanut entry to the database. Please include the restaurant name, product name, and location (latitude and longitude).</p>

<form method="POST">
    <label for="resto_name">Restaurant Name:</label><br>
    <input type="text" id="resto_name" name="resto_name" required><br><br>

    <label for="product">Product Name:</label><br>
    <input type="text" id="product" name="product_name" required><br><br>

    <label for="price">Menu Price:</label><br>
    <input type="number" step="0.01" id="price" name="price" required><br><br>

<fieldset>

    <!-- TODO: This should be an address picker eventually -->
    <label for="address">Peanut Address:</label><br>
    <input type="text" id="address" name="address" required><br><br>

    <div class="geopoint-container flex w-100 * justify-around">
        <div class="mr-4">
            <label for="geopoint_lat">Latitude:</label>
            <div>{coords.lat?.toFixed(3)}</div>
            <input hidden type="text" id="geopoint_lat" name="latitude" required>
        </div>

        <div>
            <label for="geopoint_lon">Longitude:</label>
            <div>{coords.lon?.toFixed(3)}</div>
            <input hidden type="text" id="geopoint_lon" name="longitude" required>
        </div>
        {#if isLoading}
        <Loader />
        {/if}
    </div>

</fieldset>

<br><br>
    <input type="submit" value="Submit">
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

    input[type="text"] {
        padding: 8px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    input[type="submit"] {
        padding: 10px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    input[type="submit"]:hover {
        background-color: #45a049;
    }

    /* .geopoint-container {
        display: flex;
        justify-content: flex-start;
    } */
</style>