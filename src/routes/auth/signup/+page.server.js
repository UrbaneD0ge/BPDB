import { supabase } from "$lib/supabaseClient";
import { signUpNewUser } from "$lib/supabaseClient";
import { error } from "@sveltejs/kit";

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get('email');
        const display_name = formData.get('display_name') || '';
        const password = formData.get('password');

        console.log('New user with: ', { email, display_name, password });

        const result = await signUpNewUser({ email, display_name, password });

        if (result.error) {
            return {
                success: false,
                error: result.error.message || 'Sign-up failed',
            };
        };

        return {
            success: true,
            message: 'Sign-up successful! Please check your email to confirm.',
            data: result.data,
        };
    }
};