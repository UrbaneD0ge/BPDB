import { redirect } from "@sveltejs/kit";
import * as z from "zod";

const signUpSchema = z.object({
    email: z.string().email("Please enter a valid email address").trim(),
    display_name: z.string().min(1, "Please enter a display name").trim(),
    password: z.string().min(7, "Password must be at least 7 characters long"),
});

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get('email');
        const display_name = formData.get('display_name') || '';
        const password = formData.get('password');

        const emailRedirectTo = new URL('/auth/confirm', event.url.origin).toString();

        const validation = signUpSchema.safeParse({ email, display_name, password });
        if (!validation.success) {
            return {
                success: false,
                message: validation.error.issues.map(e => e.message).join(', '),
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