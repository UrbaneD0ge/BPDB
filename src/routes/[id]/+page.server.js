import { error } from '@sveltejs/kit';
import { supabase } from "$lib/supabaseClient";
import { applyAction } from '$app/forms';

export async function load({ url }) {
    const id = url.pathname.slice(1);

    // Skip processing for non-ID requests
    if (id === 'favicon.ico' || !id || id.includes('.')) {
        throw error(404, 'Not found');
    }

    console.log('Fetching peanut data for ID:', id);

    const { data, error: dbError } = await supabase.rpc('get_peanut_and_reviews', { p_id: id });

    console.log('Get peanut and reviews:', { data, error: dbError });

    return {
        data: data ? data : null,
        error: dbError ? dbError.message : null
    };
}