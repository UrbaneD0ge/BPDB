import { error } from '@sveltejs/kit';
import { supabase } from "$lib/supabaseClient";

export async function load({ url }) {

    // console.log('Fetching peanut data for ID:', url.pathname.slice(1));

    // GET THE DATA WHERE THE ID MATCHES THE URLS PATHNAME
  const { data, error } = await supabase.rpc('get_peanut_and_reviews', { p_id: url.pathname.slice(1) });

  console.log('Supabase response:', { data, error });

  return {
    data: data ? data : null,
    error: error ? error.message : null
  };

};