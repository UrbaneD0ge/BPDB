import { redirect } from "@sveltejs/kit";
import * as z from "zod";

const signUpSchema = z.object({
    display_name: z.string("Please enter a display name").min(1, "Please enter a display name").trim(),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(7, "Password must be at least 7 characters long"),
});

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const display_name = formData.get('display_name') || null;
        const email = formData.get('email');
        const password = formData.get('password');

        const emailRedirectTo = new URL('/auth/confirm', event.url.origin).toString();

        const validation = signUpSchema.safeParse({ display_name, email, password });
        if (!validation.success) {
            console.error(z.flattenError(validation.error));
            return {
                success: false,
                // message: validation.error.issues.map(e => e.message).join(', '),
                fieldErrors: z.flattenError(validation.error),
                data: { display_name, email }
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