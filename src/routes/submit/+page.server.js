/** @satisfies {import('./$types').Actions} */
import { supabase } from '$lib/supabaseClient';

export const actions = {
    default: async (event) => {
		// if the user is logged in, post the form data to the database
        const formData = await event.request.formData();
        const resto_name = formData.get('resto_name');
        const product_name = formData.get('product_name');
        const latitude = formData.get('latitude');
        const longitude = formData.get('longitude');

        if (supabase.auth.getSession() && resto_name && product_name && latitude && longitude) {
            const { data, error } = await supabase.from('Peanuts').insert([
                {
                    resto_name,
                    product_name,
                    latitude,
                    longitude
                }
            ]);
        }

        return {
            success: true,
        };
    }
};