import { redirect } from '@sveltejs/kit';

// TODO: Add a load function that redirects if the user is not logged in

import { redirect } from '@sveltejs/kit';


export const actions = {
    default: async (event) => {

        // Validate user with secure getUser() instead of getSession()
        const { data: { user }, error: authError } = await event.locals.supabase.auth.getUser();
        if (authError || !user) {
            console.error('User is not logged in');
            throw redirect(303, '/auth/signin');
            return {
                success: false,
                message: 'User is not logged in'
            };
        }

    // Take in a new rating and submit it to the DB
        const formData = await event.request.formData();
        const resto_prod = formData.get('resto_prod');
        const user_id = formData.get('user_id');
        const servings = formData.get('servings');
        const brine = formData.get('brine');
        const salty = formData.get('salty');
        const done = formData.get('done');
        const spicy = formData.get('spicy');
        const overall = formData.get('overall');
        const notes = formData.get('notes');

        try {
            console.log('Inserting new rating with data: ', {
                resto_prod: resto_prod,
                user_id: user_id,
                servings: servings,
                brine: brine,
                salty: salty,
                done: done,
                spicy: spicy,
                overall: overall,
                notes: notes
            });
            const { data, error } = await event.locals.supabase.from('ratings').insert({
                resto_prod: resto_prod,
                user_id: user_id,
                servings: servings,
                brine: brine,
                salty: salty,
                done: done,
                spicy: spicy,
                overall: overall,
                notes: notes
            })
            if (error) {
                throw error;
            }
    } catch (error) {
            console.error('Error rating peanut:', error);
            return {
                success: false,
                message: 'Error rating peanut: ' + (error.message || 'Unknown error')
            };
        }
  }
}