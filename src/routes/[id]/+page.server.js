import { error } from '@sveltejs/kit';

export async function load({ url }) {

  try {

    // GET THE DATA WHERE THE ID MATCHES THE URLS PATHNAME
    const { data, error } = await supabase.select('*').from('Peanuts').eq('id', url.pathname[1]).single();

  } catch (err) {
    console.error('Unexpected error fetching peanut data:', err);
    throw error(500, 'Unexpected error fetching peanut data');
  }
    if (error) {
      throw error(500);
    }

  console.log(url.pathname[1]);
  // console.log(JSON.stringify(data));

  if (!data) {
    throw error(404)
  }

  return {
    NPUs: JSON.parse(JSON.stringify(data)),
  };
};