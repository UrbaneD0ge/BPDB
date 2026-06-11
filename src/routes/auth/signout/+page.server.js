import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
    console.log('Signing Out!')
  cookies.delete('session', { path: '/' });
  throw redirect(303, '/');
};
