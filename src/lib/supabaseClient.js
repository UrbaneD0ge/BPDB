import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, PGDB, email_pw } from "$env/static/public"

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

async function signUpNewUser() {
    console.log("Signing up new user...");

    try {
        const { data, error } = await supabase.auth.signUp({
            email: 'kipling.dunlap@gmail.com',
            password: 'yourMom1234!',
            options: {
                emailRedirectTo: 'http://localhost:5173/auth/confirm',
            },
        });
        if (error) {
            console.error('Sign-up error:', error);
            return { error };
        }
        console.log('Sign-up successful:', data);
        return { data };
    } catch (err) {
        console.error('Unexpected sign-up error:', err);
        return { error: err };
    }
}

async function signInWithEmail() {
  console.log("Signing in with email and password...");
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'kipling.dunlap@gmail.com',
      password: 'yourMom1234!',
    });

    if (error) {
      console.error('Sign-in error:', error);
      return { error };
    }

    console.log('Sign-in successful:', data);
    return { data };
  } catch (err) {
    console.error('Unexpected sign-in error:', err);
    return { error: err };
  }
}

export { signUpNewUser, signInWithEmail };