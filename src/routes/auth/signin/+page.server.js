import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async (event) => {
        // get credentials from the form submission
        const formData = await event.request.formData();
        const email = formData.get('email')
        const password = formData.get('password')

        // Use server-side Supabase client with SSR cookie handler
        const { data, error } = await event.locals.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return {
                success: false,
                error: error.message || 'Sign-in failed',
            };
        }

        if (!data.user) {
            return {
                success: false,
                error: "Invalid credentials",
            };
        }

        // Redirect after successful signin
        throw redirect(303, "/");
    }
};


