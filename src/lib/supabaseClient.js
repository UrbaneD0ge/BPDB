import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, NEXT_PUBLIC_SITE_URL } from "$env/static/public"

const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseKey = PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// console.log('supabaseKey:', supabaseKey ? 'Present' : 'Missing');
// console.log('PUBLIC_SUPABASE_URL:', PUBLIC_SUPABASE_URL ? 'Present' : 'Missing');

export const supabase = createClient(supabaseUrl, supabaseKey);

const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`
  return url
}

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
            emailRedirectTo: getURL() + 'auth/confirm',
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
    } catch (error) {
        console.error('Unexpected sign-up error:', error);
        return { error: error };
    }
}

async function signInWithPassword({email, password}) {
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

    return { data };
  } catch (error) {
    console.error('Unexpected sign-in error:', error);
    return { error: error };
  }
}

async function signOut() {
  const { error } = await supabase.auth.signOut()
  return {
    data: null,
    user: null,
    error: error || null
  }
}

export { signUpNewUser, signInWithPassword, signOut };