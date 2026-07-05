<script>
    import Peanut from "$lib/Peanut.svelte";
</script>

<main class="h-svh flex flex-col justify-center items-center gap-4 font-rounded-regular px-2 py-2 lg:px-8 lg:py-12">

    <h1 class="text-white text-4xl font-rounded-extrabold">Nuts! Something went wrong.</h1>
    <p class="text-white text-2xl">The page you are looking for does not exist or has been removed.<br>Please check the URL or return to the <a href="/" class="text-green-500 hover:underline">home page</a>.</p>

    <div class="h-svh flex justify-center items-center">
        <Peanut id="peanut" size={150} clipHeight={100} rotation={0} />
    </div>

</main>