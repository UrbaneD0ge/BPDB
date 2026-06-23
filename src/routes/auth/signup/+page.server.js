import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get('email');
        const display_name = formData.get('display_name') || '';
        const password = formData.get('password');

        const emailRedirectTo = new URL('/auth/confirm', event.url.origin).toString();

        if (!email || !password) {
            return {
                success: false,
                message: 'Email and password are required',
            };
        }

        const { error } = await event.locals.supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo,
                data: {
                    display_name
                }
            }
        });

        if (error) {
            return {
                success: false,
                message: error.message || 'Sign-up failed',
            };
        }

        // Redirect after successful signup
        throw redirect(303, '/auth/signin');
    }
};