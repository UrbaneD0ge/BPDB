import { supabase } from "$lib/supabaseClient";
import { createClient } from '@supabase/supabase-js'
import { signInWithEmail, signUpNewUser } from "$lib/supabaseClient";

export async function load() {

    // await signUpNewUser();

    // await signInWithEmail();

    supabase.from('Peanuts').insert([
            {
                name: 'Supa Burger',
                location: 'POINT(-73.946823 40.807416)',
          },
          {
              name: 'Supa Pizza',
              location: 'POINT(-73.94581 40.807475)',
            },
            {
                name: 'Supa Taco',
                location: 'POINT(-73.945826 40.80629)',
            },
    ])

    const { data } = await supabase.from("Peanuts").select();

    console.log("Peanuts data:", data);
  return {
    peanuts: data ?? [],
  };
}
