<script>
    import { enhance } from "$app/forms";
    import { preventDefault } from "svelte/legacy";

    let { data, form } = $props();
    // let disabled = $state(false);

    // $inspect(form);
</script>

<h1>Sign Up</h1>
<h2 class="font-medium text-2xl">Sign up to be a BPDB contributor!</h2><br>
<form method="POST" use:enhance>
    <label for="display_name">Display Name:</label>
    <input type="text" id="display_name" name="display_name" autocomplete="off" class="invalid:border-red-700! invalid:border-4" required><br><br>

    <label for="email">eMail:</label>
    <input type="email" id="email" name="email" class="invalid:border-red-700! invalid:border-4" autocomplete="email" required><br><br>


    <label for="password">Password:</label>
    <input type="password" id="password" name="password" autocomplete="current-password" class="invalid:border-red-700! invalid:border-4" required><br><br>

    {#if form }
        <p class="error-message">Error: {form?.message}</p>
    {/if}

    <button class="p-4 bg-green-500 text-white rounded-md hover:bg-green-700 cursor-pointer" type="submit" value="Sign Up" >Send Signup Email</button>
</form>

<style lang="postcss">
@reference "tailwindcss";

.error-message {
    color: #af1d1d;
    font-size: 0.9rem;
    margin-top: 0.25rem;
}
</style>