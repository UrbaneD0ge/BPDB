import {  redirect } from "@sveltejs/kit";
import { supabase, signUpNewUser } from "$lib/supabaseClient";

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get('email');
        const display_name = formData.get('display_name') || '';
        const password = formData.get('password');

        const { data, error } = await signUpNewUser({
            email,
            display_name,
            password
        });

        if (error) {
            // throw redirect(303, '/auth/signup')
            return {
                success: false,
                message: error.message || 'Sign-up failed',
            };
        }
        console.log('Redirect!')
        // Redirect after successful signup
        throw redirect(303, '/auth/signin');
    }
};