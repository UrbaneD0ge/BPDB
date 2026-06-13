<script>
    import { enhance } from "$app/forms";

    let { data, form } = $props();

    // console.log(data)
</script>

<h1>Sign Up</h1>
<p>Sign up to be a BPDB contributor!</p>
<form method="POST">
    <label for="display_name">Display Name:</label><br>
    <input type="text" id="display_name" name="display_name" autocomplete="off"><br><br>

    <label for="email">eMail:</label><br>
    <input type="email" id="email" name="email" autocomplete="email" required><br><br>


    <label for="password">Password:</label><br>
    <input type="password" id="password" name="password" autocomplete="current-password" required><br><br>

    {#if form?.error}
        <p class="error-message">{form.error}</p>
    {/if}

    <input class="button" type="submit" value="Sign Up">
</form>

<style lang="postcss">
@reference "tailwindcss";
input[type="submit"] {
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.error-message {
    color: #dc2626;
    font-size: 0.9rem;
    margin-top: 0.25rem;
}
</style>