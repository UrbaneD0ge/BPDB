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
                message: 'User is not logged in'
            };
        }

        const formData = await event.request.formData();
        const resto_name = formData.get('resto_name');
        const product_name = formData.get('product_name');
        const price = formData.get('price');
        const address = formData.get('address');
        const latitude = formData.get('latitude');
        const longitude = formData.get('longitude');

        if (!resto_name || !product_name || !latitude || !longitude) {
            console.error(resto_name, product_name, address, latitude, longitude);
            return {
                success: false,
                message: 'Missing required fields or user not logged in'
            };
        }

        try {
            // console.log('Inserting peanut with data:', {
            //     p_resto_name: resto_name,
            //     p_product: product_name,
            //     price: price,
            //     address: address,
            //     p_lon: parseFloat(longitude),
            //     p_lat: parseFloat(latitude)
            // });
            const { data, error } = await event.locals.supabase.rpc('insert_peanut', {
                p_resto_name: resto_name,
                p_product: product_name,
                p_price: price,
                p_address: address,
                p_lon: parseFloat(longitude),
                p_lat: parseFloat(latitude)
            }).select('*');


            if (error) {
                throw error;
            }
            // return {
            //     success: true,
            //     message: 'Peanut submitted successfully',
            //     data: data,
            // };

            // TODO: Redirect to the new ID/rate page
            console.log(data)
            throw redirect(303, `/${data.id}/rate`);


        } catch (error) {
            console.error('Error inserting peanut:', error);
            return {
                success: false,
                message: 'Error inserting peanut: ' + (error.message || 'Unknown error')
            };
        };
    }
};