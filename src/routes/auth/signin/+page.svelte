<script>
    let { form } = $props();

    // $inspect(form);
</script>

<main class="h-svh pt-12 m-2">

    <form method="POST">
        <h1 class="text-white">Sign In</h1>

        <p class="text-white">Use the form below to sign in to your account.</p><br>
            <label for="email">Email: <span class="text-red-700 italic">{form?.fieldErrors?.fieldErrors?.email}</span></label>
            <input type="email" id="email" name="email" autocomplete="email" value={form?.data?.email || ''} class="invalid:border-red-700! invalid:border-4"><br><br>

            <label for="password">Password: <span class="text-red-700 italic">{form?.fieldErrors?.fieldErrors?.password}</span></label>
            <input type="password" id="password" name="password" autocomplete="current-password" class="invalid:border-red-700 invalid:border-4 form"><br><br>

            <div class="flex flex-col lg:flex-row-reverse justify-end gap-2">
                {#if form?.message || form?.error }
                <p class="text-red-700 italic p-2">{form?.message || form?.error}</p>
                {/if}
                <button type="submit" value="Sign In" class="bg-green-500 hover:bg-green-700 p-2 rounded-md text-white" >Sign In</button>
            </div>

            <br>
            <p class="text-white my-2">Don't have an account?<br><a href="/auth/signup" class="underline">Sign up!</a></p>

    </form>
</main>