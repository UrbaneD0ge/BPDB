<script>
    import Peanut from "$lib/Peanut.svelte";
    import { MediaQuery } from 'svelte/reactivity';

    const large = new MediaQuery('min-width: 1024px');
    $inspect(large.current, "large");

    let fillHex = $state("#a38226");
    let strokeHex = $state("#765d1f");
</script>

<main class="h-svh flex flex-col justify-start items-center gap-4 font-rounded-regular px-2 py-2 lg:px-8 lg:py-12">

    <h1 class="text-white text-4xl font-rounded-extrabold">Nuts! Something went wrong.</h1>
    <p class="text-white text-2xl">The page you are looking for does not exist or has been removed.<br>Please check the URL or return to the <a href="/" class="text-green-500 hover:underline">home page</a>.</p>

    <form class="flex flex-col text-white gap-2 lg:flex-row lg:gap-4 justify-start items-center m-0! z-10">
    <input
        type="color"
        class="color-picker"
        id="foreground"
        name="foreground"
        bind:value={strokeHex} />
    <label for="foreground">Stroke color</label>

    <input
        type="color"
        class="color-picker"
        id="background"
        name="background"
        bind:value={fillHex}
        colorspace="limited-srgb"
        alpha />
    <label for="background">Fill color</label>
    </form>

    <div id="peanut-container" class="flex justify-center items-center top-[60svh] lg:top-[35svh]">
        <Peanut id="peanut" size={large.current ? 150 : 75} clipHeight={100} rotation={45} fillHex={fillHex} strokeHex={strokeHex} />
    </div>

</main>

<style>
    #peanut-container {
        position:absolute;
        left:50%;
        transform: translateX(-50%);
    }

    .color-picker {
        width: 2.5rem;
        height: 2.5rem;
        border: 0;
        border-radius: 9999px;
        background: transparent;
        padding: 0;
        overflow: hidden;
        cursor: pointer;
        appearance: none;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.5);
    }

    .color-picker::-webkit-color-swatch-wrapper {
        padding: 0;
        border-radius: 9999px;
    }

    .color-picker::-webkit-color-swatch {
        border: 0;
        border-radius: 9999px;
    }

    .color-picker::-moz-color-swatch {
        border: 0;
        border-radius: 9999px;
    }
</style>