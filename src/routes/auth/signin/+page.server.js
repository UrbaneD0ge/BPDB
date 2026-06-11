import { redirect } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";
import { signInWithEmail } from "$lib/supabaseClient";

export const actions = {
    default: async (event) => {
        // get credentials from the form submission
        const formData = await event.request.formData();
        const email = formData.get('email')
        const password = formData.get('password')

        const result = await signInWithEmail({ email, password });

                if (result.error) {
            return {
                success: false,
                error: result.error.message || 'Sign-in failed',
            };
        }


        // if already signed in, redirect to the home page
        if (supabase.auth.getSession()) {
            console.log("User is already signed in, redirecting to home page...");
            redirect(303, "/");
            return {
                success: true,
            };
        } else {
            // if not, return an error message
            return {
                success: false,
                error: "Invalid credentials",
            };
        }

        return {
            success: true,
            message: 'Sign-in successful! Please check your email to confirm.',
            data: result.data,
        };
    }
};


