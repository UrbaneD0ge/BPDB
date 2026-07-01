import { redirect } from '@sveltejs/kit';


export const actions = {

  default: async ({ locals: { supabase } }) => {
    console.log('Signing Out!')

    // Use server-side Supabase client to destroy JWT and clear auth cookies
    await supabase.auth.signOut();

    // Redirect after successful signout
    throw redirect(303, '/auth/signin');
  }
};
