import { redirect } from '@sveltejs/kit';
import { signOut } from '$lib/supabaseClient.js'


export const load = async ({ locals: { safeGetSession }, cookies }) => {
  console.log('Signing Out!')
  let { session, user } = await safeGetSession()

  await signOut();
  cookies.delete('session', { path: '/' });
  cookies.set('session', '', { path: '/', maxAge: 0 });


  // console.log(session, user)
  throw redirect(303, '/');
  return {
    session: null,
    user: null
  }
};
