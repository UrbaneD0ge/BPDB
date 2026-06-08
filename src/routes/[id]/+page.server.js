import { error } from '@sveltejs/kit';
import { supabase } from "$lib/supabaseClient";

export async function load({ url }) {

    console.log('Fetching peanut data for ID:', url.pathname[1]);

    // GET THE DATA WHERE THE ID MATCHES THE URLS PATHNAME
    const { data, error } = await supabase.from('Peanuts')
      .select('*').eq('id', url.pathname[1]);

    if (error) {
      console.error('Error fetching peanut data:', error);
      throw error(500, 'Error fetching peanut data');
    } else if (!data) {
      console.warn('No peanut data found for ID:', url.pathname[1]);
      throw error(404, 'Peanut not found');
    } else {
      console.log('Peanut data fetched successfully:', data);
      return {
        data: data,
        error: null
      };
    }

};