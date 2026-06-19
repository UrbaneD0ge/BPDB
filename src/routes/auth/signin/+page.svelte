<script>
    let { form } = $props();

    // $inspect(form);
</script>

<h1>Sign In</h1>
<p>Use the form below to sign in to your account.</p>

    <form method="POST">
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" autocomplete="email" required><br><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" autocomplete="current-password" required><br><br>

        <button type="submit" value="Sign In" class="bg-green-500 hover:bg-green-700 p-2 rounded-md text-white" >Sign In</button>
        <!-- TODO: Get form messages/errors! -->
         {#if form?.message || form?.error }
         <p class="text-red-800">{form?.message || form?.error}</p>
         {/if}
    <br><br>
        <p class="my-2">Don't have an account? <a href="/auth/signup" class="underline">Sign up here</a>.</p>

    </form>

<!-- <style lang="postcss">
@reference "tailwindcss"

</style> -->