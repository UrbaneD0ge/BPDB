/** @satisfies {import('./$types').Actions} */
import { supabase } from '$lib/supabaseClient';

export const actions = {
    default: async (event) => {

        // console.log('Received form submission');

        const session = await supabase.auth.getSession();
        if (!session.data.session) {
            console.Console.error('User is not logged in');
            return {
                success: false,
                message: 'User is not logged in'
            };
        }

        const formData = await event.request.formData();
        const resto_name = formData.get('resto_name');
        const product_name = formData.get('product_name');
        const address = formData.get('address')
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
            console.log('Inserting peanut with data:', {
                p_resto_name: resto_name,
                p_product: product_name,
                // address: address,
                p_lon: parseFloat(longitude),
                p_lat: parseFloat(latitude)
            });
            const { data, error } = await supabase.rpc('insert_peanut', {
                p_resto_name: resto_name,
                p_product: product_name,
                // address: address,
                p_lon: parseFloat(longitude),
                p_lat: parseFloat(latitude)
            });

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Error inserting peanut:', error);
            return {
                success: false,
                message: 'Error inserting peanut: ' + (error.message || 'Unknown error')
            };
        }

        return {
            success: true,
            message: 'Peanut submitted successfully'
        };
    }
};