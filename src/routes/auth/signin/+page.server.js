import { redirect } from "@sveltejs/kit";
import { supabase, signInWithPassword } from "$lib/supabaseClient.js";
import * as z from "zod";

const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export const actions = {
    default: async (event) => {
        // get credentials from the form submission
        const formData = Object.fromEntries(await event.request.formData());
        const email = formData.email;
        const password = formData.password;

        // Validate the form data
        const result = signInSchema.safeParse(formData);
        if (!result.success) {
            console.log(result.error);
            return {
                success: false,
                message: "Invalid input",
                fieldErrors: z.flattenError(result.error),
                data: formData
            };
        }

        // Use server-side Supabase client with SSR cookie handler
        const { data, error } = await event.locals.supabase.auth.signInWithPassword({
            email,
            password
        });


        if (error) {
            return {
                success: false,
                message: error.message || 'Sign-in failed',
            };
        }

        if (!data.user) {
            return {
                success: false,
                message: "Invalid credentials",
            };
        }

        // Redirect after successful signin
        throw redirect(303, "/");
    }
};


