import { redirect } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";
import { signInWithEmail } from "$lib/supabaseClient";

export async function load() {

    // get credentials from the form submission

    await signInWithEmail();

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
    };
}

