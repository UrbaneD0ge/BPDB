import { supabase } from "$lib/supabaseClient";
import { createClient } from '@supabase/supabase-js'
import { signInWithEmail, signUpNewUser } from "$lib/supabaseClient";
import { PGAPIKEY } from "$env/static/private";
import { PUBLIC_SUPABASE_PUBLISHABLE_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public";

export async function load() {

  if (!PGAPIKEY || !PUBLIC_SUPABASE_URL) {
    console.error('Missing environment variables for Supabase');
    console.log('PGAPIKEY:', PGAPIKEY ? 'Present' : 'Missing');
    console.log('PUBLIC_SUPABASE_URL:', PUBLIC_SUPABASE_URL ? 'Present' : 'Missing');
    return {
      peanuts: [],
      error: 'Supabase configuration is missing'
    };
  }

  const serverSupabase = createClient(PUBLIC_SUPABASE_URL, PGAPIKEY);

  const { data: userData, error: userError } = await serverSupabase.auth.getUser();
  if (userError) {
    console.error('Error getting user:', userError);
  } else {
    console.log('Current user:', userData?.user);
  }

  const { data, error } = await serverSupabase.functions.invoke('peanuts-geopoints', { body: { name: 'Functions'}})
  if(error) {
    console.error('Error invoking Supabase function:', error);
    return {
      peanuts: [],
      error: error.message || 'Error fetching peanuts data'
    };
  }
  console.log('Peanuts data:', data);
  return {
    peanuts: data ?? [],
    error: null
  };

  // const select = `id, ST_Y(geopoint) as lat, ST_X(geopoint) as lng`;
  // await signUpNewUser();
  // await signInWithEmail();

  // Fetch peanuts data from the Supabase function
  // const endpoint = `${PUBLIC_SUPABASE_URL}/functions/v1/peanuts-geopoints`;

  // const response = await fetch(endpoint, {
  //   headers: {
  //     'Authorization': `Bearer ${PGAPIKEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   method: 'POST',
  //   body: JSON.stringify({})
  // });

  // const data = await response.json();
  // console.log('Peanuts data:', data);

    // .then(response => response.json())
    // .then(data => {
    //   console.log('Peanuts data:', data);
    // })
    // .catch(error => {
    //   console.error('Error fetching peanuts data:', error);
    // });

  // const
  //   { data, error } =
  //     await supabase.functions.invoke('peanuts-geopoints');

  // console.log("Peanuts data:", data);
  // console.error("Peanuts error:", error);
  // return {
  //   peanuts: data ?? [],
  //     error: error?.message || null
  // };

}
