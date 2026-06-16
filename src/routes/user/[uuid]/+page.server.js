import { supabase } from "$lib/supabaseClient";


export async function load({ url }) {
    const uuid = url.pathname.split('/')[2].slice(1);
    // console.log(uuid)

    const { data, error } = await supabase.from('ratings').select('*').eq('user_id', uuid).select();

    return {
    data: data ? data : null,
    error: error ? error.message : null
    };
}