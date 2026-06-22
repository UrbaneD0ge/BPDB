import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async (event) => {

        // console.log('Received form submission');

        // Validate user with secure getUser() instead of getSession()
        const { data: { user }, error: authError } = await event.locals.supabase.auth.getUser();
        if (authError || !user) {
            console.error('User is not logged in');
            return {
                success: false,
                message: 'User is not logged in',
            };
        };

        // console.log(user)

        const formData = await event.request.formData();
        let resto_name = formData.get('resto_name')?.trim();
        let product_name = formData.get('product_name')?.trim();
        let price = formData.get('price')?.trim();
        let address = formData.get('address')?.trim();
        let latitude = formData.get('latitude')?.trim();
        let longitude = formData.get('longitude')?.trim();

        // Validate required fields
        if (!resto_name || !product_name || !latitude || !longitude) {
            console.error('Validation failed:', { resto_name, product_name, address, latitude, longitude });
            return {
                success: false,
                message: 'Missing required fields'
            };
        }

        // Validate latitude and longitude are valid numbers
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            console.error('Invalid coordinates:', { latitude, longitude });
            return {
                success: false,
                message: 'Invalid latitude or longitude values'
            };
        }

        // Validate price if provided
        if (price && isNaN(parseFloat(price))) {
            console.error('Invalid price:', price);
            return {
                success: false,
                message: 'Invalid price value'
            };
        }

        const { data, error } = await event.locals.supabase.rpc('insert_peanut', {
            p_resto_name: resto_name,
            p_product: product_name,
            p_price: price,
            p_address: address,
            p_lon: parseFloat(longitude),
            p_lat: parseFloat(latitude)
        });

        if (error) {
            console.error('Error inserting peanut:', error);
            return {
                success: false,
                message: 'Error inserting peanut: ' + (error.message || 'Unknown error')
            };
        }

        if (!data || !data.id) {
            console.error('Insert returned unexpected data:', data);
            return {
                success: false,
                message: 'Insert succeeded but did not return an id'
            };
        }

        throw redirect(303, `/${data.id}/rate`);
    }
};