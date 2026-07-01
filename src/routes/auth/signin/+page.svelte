<script>
    let { form } = $props();

    $inspect(form);
</script>

<h1>Sign In</h1>

<form method="POST">
    <p class="text-white">Use the form below to sign in to your account.</p><br>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" autocomplete="email" class="invalid:border-red-700!  invalid:border-4" required><br><br>

        <label for="password">Password:</label>
        <input type="password" id="password" name="password" autocomplete="current-password" class="invalid:border-red-700 invalid:border-4" required><br><br>

        <div class="flex flex-col lg:flex-row-reverse justify-end gap-2">
            {#if form?.message || form?.error }
            <p class="text-red-700 italic p-2">{form?.message || form?.error}</p>
            {/if}
            <button type="submit" value="Sign In" class="bg-green-500 hover:bg-green-700 p-2 rounded-md text-white" >Sign In</button>
        </div>

    <br>
        <p class="text-white my-2">Don't have an account?<br><a href="/auth/signup" class="underline">Sign up!</a></p>

    </form>

<!-- <style lang="postcss">
@reference "tailwindcss"

</style> -->