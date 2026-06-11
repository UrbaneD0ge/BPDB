import { supabase } from "$lib/supabaseClient";
import { signUpNewUser } from "$lib/supabaseClient";
import { error } from "@sveltejs/kit";

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get('email')
        const userName = formData.get('userName')
        const password = formData.get('password')

        const result = await signUpNewUser({ email, userName, password })
        
        if (result.error) {
            return {
                success: false,
                error: result.error.message || 'Sign-up failed',
            };
        }

        return {
            success: true,
            message: 'Sign-up successful! Please check your email to confirm.',
            data: result.data,
        };
    }
};