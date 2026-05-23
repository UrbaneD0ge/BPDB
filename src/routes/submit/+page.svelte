<h1>Submit a new BP to the DB!</h1>
<p>Use the form below to submit a new boiled peanut entry to the database. Please include the restaurant name, product name, and location (latitude and longitude).</p>

<form action="POST">
    <label for="resto_name">Restaurant Name:</label><br>
    <input type="text" id="resto_name" name="resto_name" required><br><br>

    <label for="product">Product Name:</label><br>
    <input type="text" id="product" name="product" required><br><br>


    <!-- TODO: Hide this field and display a spinner until geolocation is available -->
    <label for="geopoint">Location (latitude, longitude):</label><br>
    <input type="text" id="geopoint" name="geopoint" placeholder="e.g. 33.7506, -84.38" required><br><br>

    <input type="submit" value="Submit">
</form>

<script>
    // get geolocation and fill in the geopoint field
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            document.getElementById('geopoint').value = `${lat}, ${lon}`;
        });
    } else {
        console.warn('Geolocation is not supported by this browser.');
    }
</script>