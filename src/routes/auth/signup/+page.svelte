<script>
    import { enhance } from "$app/forms";
  import { preventDefault } from "svelte/legacy";

    let { data, form } = $props();
    let disabled = $state(false);

    $inspect(form, disabled)
</script>

<h1>Sign Up</h1>
<p>Sign up to be a BPDB contributor!</p>
<form method="POST">
    <label for="display_name">Display Name:</label><br>
    <input type="text" id="display_name" name="display_name" autocomplete="off" required><br><br>

    <label for="email">eMail:</label><br>
    <input type="email" id="email" name="email" autocomplete="email" required><br><br>


    <label for="password">Password:</label><br>
    <input type="password" id="password" name="password" autocomplete="current-password" required><br><br>

    {#if form }
        <p class="error-message">{JSON.stringify(form.user)}</p>
    {/if}

    <button class="p-4 bg-green-500 text-white rounded-md hover:bg-green-700 cursor-pointer" type="submit" value="Sign Up" onclick={!disabled} disabled={disabled}>Send Signup Email</button>
</form>

<style lang="postcss">
@reference "tailwindcss";

.error-message {
    color: #dc2626;
    font-size: 0.9rem;
    margin-top: 0.25rem;
}
</style>