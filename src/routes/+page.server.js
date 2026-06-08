import { supabase } from "$lib/supabaseClient";
import { createClient } from '@supabase/supabase-js'
import { signInWithEmail, signUpNewUser } from "$lib/supabaseClient";
import { PGAPIKEY } from "$env/static/private";
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";

export async function load() {

  const serverSupabase = createClient(PUBLIC_SUPABASE_URL, PGAPIKEY);

  try {

    // THE QUERY HERSELF
    const { data, error } = await supabase.rpc('get_peanuts_xy');


    if (error) {
      console.error('Error fetching peanuts data:', error);
      return {
        peanuts: [],
        error: error.message || 'Error fetching peanuts data'
      };
    }
    // console.log('Peanuts data:', data);
    return {
      peanuts: data ?? [],
      error: null
    };
  } catch (error) {
    console.error('Unexpected error fetching peanuts data:', error);
    return {
      peanuts: [],
      error: error.message || 'Unexpected error fetching peanuts data'
    };
  }
}
