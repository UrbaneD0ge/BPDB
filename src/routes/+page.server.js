import { supabase } from "$lib/supabaseClient";
import { createClient } from '@supabase/supabase-js'

export async function load() {
    const { data } = await supabase.from("Peanuts").select();
    console.log("Peanuts data:", data);
  return {
    peanuts: data ?? [],
  };
}

