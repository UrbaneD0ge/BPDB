import { supabase } from "$lib/supabaseClient";

export async function load({ url }) {
    const uuid = url.pathname.split('/')[2].slice(1);
    // console.log(uuid)

    // also fetch resto_name and product from Peanuts where ratings.resto_prod = Peanuts.id
    // const { data, error } = await supabase
    //     .from('ratings')
    //     .select('*,Peanuts(resto_name,product)')
    //     .eq('user_id', uuid);

        const { data, error } = await supabase.rpc('get_user_peanuts_with_reviews', { target_user_id: uuid });

    return {
    data: data ? data : null,
    error: error ? error.message : null
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