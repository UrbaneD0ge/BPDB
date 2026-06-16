import { error, redirect } from "@sveltejs/kit";
import { supabase, signUpNewUser } from "$lib/supabaseClient";

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get('email');
        const display_name = formData.get('display_name') || '';
        const password = formData.get('password');

        const { data, error } = await signUpNewUser({ email, display_name, password });

        if (error) {
            return {
                success: false,
                message: error.message,
                error: error || 'Sign-up failed',
            };
        }
        // TODO: Handle duplicate email sign-ups!
        throw redirect(303, '/');
    }
};