<script>
    import { enhance } from "$app/forms";
    import { preventDefault } from "svelte/legacy";

    let { data, form } = $props();
    // let disabled = $state(false);

    $inspect(form);
</script>

<main class="h-svh pt-12">
<h1>Sign Up</h1>
<form method="POST" use:enhance>
    <p class="text-white">Sign up to be a BPDB contributor!</p><br>
    <label for="display_name">Display Name: <span class="error-message italic">{form?.fieldErrors?.fieldErrors?.display_name}</span></label>
    <input type="text" id="display_name" name="display_name" value={form?.data?.display_name} autocomplete="off" class="invalid:border-red-700! invalid:border-4"><br><br>

    <label for="email">eMail: <span class="error-message italic">{form?.fieldErrors?.fieldErrors?.email}</span></label>
    <input type="email" id="email" name="email" value={form?.data?.email} class="invalid:border-red-700! invalid:border-4" autocomplete="email"><br><br>


    <label for="password">Password: <span class="error-message italic">{form?.fieldErrors?.fieldErrors?.password}</span></label>
    <input type="password" id="password" name="password" autocomplete="current-password" class="invalid:border-red-700! invalid:border-4"><br><br>

    {#if form }
        <p class="error-message italic">{form?.message}</p>
    {/if}

    <button class="p-4 bg-green-500 text-white rounded-md hover:bg-green-700 cursor-pointer" type="submit" value="Sign Up" >Send Signup Email</button>
</form>
</main>
<style lang="postcss">
@reference "tailwindcss";

.error-message {
    color: #af1d1d;
    font-size: 1.2rem;
    margin-top: 0.25rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    font-weight: normal;
}
</style>