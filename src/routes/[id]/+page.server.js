import { error } from '@sveltejs/kit';
import { supabase } from "$lib/supabaseClient";

export async function load({ url }) {

    console.log('Fetching peanut data for ID:', url.pathname[1]);

    // GET THE DATA WHERE THE ID MATCHES THE URLS PATHNAME
    const { data, error } = await supabase.from('Peanuts')
      .select('*')
    .eq('id', url.pathname[1]);

  // console.log('Supabase response:', { data, error });

  return {
    peanut: data ? data[0] : null,
    error: error ? error.message : null
  };

};