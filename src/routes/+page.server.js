import { supabase } from "$lib/supabaseClient";
import { createClient } from '@supabase/supabase-js'
import { signInWithEmail, signUpNewUser } from "$lib/supabaseClient";

export async function load() {

    // await signUpNewUser();

    // await signInWithEmail();

    // const { data: insertedData } = await supabase.from('Peanuts').insert([
    //         {
    //             resto_name: 'Supa Burger',
    //             geopoint: 'POINT(-73.946823 40.807416)',
    //       },
    //       {
    //           resto_name: 'Supa Pizza',
    //           geopoint: 'POINT(-73.94581 40.807475)',
    //         },
    //         {
    //             resto_name: 'Supa Taco',
    //             geopoint: 'POINT(-73.945826 40.80629)',
    //         },
    // ])

    const { data } = await supabase.from("Peanuts").select();

    console.log("Peanuts data:", data);
  return {
    peanuts: data ?? [],
  };
}
