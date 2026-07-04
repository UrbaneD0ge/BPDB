import { supabase } from "$lib/supabaseClient";
import { redirect } from "@sveltejs/kit";

export async function load({ url }) {
    const uuid = url.pathname.split('/')[2].slice(1); // Extract the UUID from the URL
    console.log(url.pathname.Number); // Extract the UUID from the URL

    const { data: userInfo, error: userInfoError } = await supabase.rpc("get_user_info", {
            target_user_id: uuid
        });

    if (userInfoError) {
        console.error('Error fetching user info:', userInfoError);
        throw redirect(303, '/error');
    }
    // userInfo should be an array with 0 or 1 row

    const requestUser = userInfo?.[0];

    const { data: rows, error: rowsError } = await supabase.rpc('get_user_peanuts_with_reviews', { target_user_id: uuid });

    return {
    user: requestUser ? requestUser : null,
    ratings: rows ? rows : null,
    error: rowsError ? rowsError.message : null
    };
}

export const actions = {
    delete: async ({ request, locals }) => {
        const formData = await request.formData();
        const ratingID = formData.get('id');

        if (!ratingID) {
            return { success: false, message: 'Missing rating id' };
        }

        const { data: { user }, error: authError } = await locals.supabase.auth.getUser();
        if (authError || !user) {
            return { success: false, message: 'User is not logged in' };
        }

        const { data, error } = await locals.supabase
            .from('ratings')
            .delete()
            .eq('id', Number(ratingID));

        if (error) {
            console.error('Delete error:', error);
            return { success: false, message: error.message };
        }

        console.log('Deleted rating:', data);
        return { success: true };
    }
};