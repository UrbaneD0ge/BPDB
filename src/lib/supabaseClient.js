import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from "$env/static/public"

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// console.log('supabaseKey:', supabaseKey ? 'Present' : 'Missing');
// console.log('PUBLIC_SUPABASE_URL:', PUBLIC_SUPABASE_URL ? 'Present' : 'Missing');

export const supabase = createClient(supabaseUrl, supabaseKey);

async function signUpNewUser({ email, display_name, password }) {
    console.log("Signing up new user...");

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
          // user_metadata: {
          //     display_name: display_name
          //   },
          options: {
            emailRedirectTo: '/auth/confirm',
            data: {
                  display_name: display_name
                },
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

async function signInWithEmail({email, password}) {
  console.log("Signing in with email and password...");
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Sign-in error:', error);
      return { error };
    }

    console.log('Sign-in successful:',
      // data
    );
    return { data };
  } catch (err) {
    console.error('Unexpected sign-in error:', err);
    return { error: err };
  }
}

async function signOut() {
  const { err } = await supabase.auth.signOut()
  return {
    data: null,
    user: null
  }
}

export { signUpNewUser, signInWithEmail, signOut };