import { redirect } from '@sveltejs/kit';
import * as z from 'zod';

const peanutSchema = z.object({
    resto_name: z.string().min(1, "Please enter a restaurant name").trim(),
    product_name: z.string().min(1, "Please enter a product name").trim(),
    price: z.coerce.number().refine((val) => !val || !isNaN(parseFloat(val)), {
        message: "Invalid price value"
    }),
    address: z.string().min(1, "Please enter an address").trim(),

    latitude: z.coerce.number().gt(-90, "Latitude must be greater than -90").lt(90, "Latitude must be less than 90").refine((val) => !isNaN(parseFloat(val)), {
        message: "Invalid latitude value"
    }),
    longitude: z.coerce.number().gt(-180, "Longitude must be greater than -180").lt(180, "Longitude must be less than 180").refine((val) => !isNaN(parseFloat(val)), {
        message: "Invalid longitude value"
    })
});

export const actions = {
    default: async (event) => {

        // Validate user with secure getUser() instead of getSession()
        const { data: { user }, error: authError } = await event.locals.supabase.auth.getUser();
        if (authError || !user) {
            console.error('User is not logged in');
            return {
                success: false,
                message: 'User is not logged in',
            };
        }

        // console.log(user)

        const formData = Object.fromEntries(await event.request.formData());
        let resto_name = formData.resto_name?.trim();
        let product_name = formData.product_name?.trim();
        let price = formData.price?.trim();
        let address = formData.address?.trim();
        let latitude = formData.latitude?.trim();
        let longitude = formData.longitude?.trim();

        // Validate required fields
        const validation = peanutSchema.safeParse(formData);
        if (!validation.success) {
            console.error(validation.error);
            console.log(validation);
            return {
                success: false,
                message: validation.error.issues.map(e => e.message).join(', '),
                fieldErrors: z.flattenError(validation.error),
                data: formData
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