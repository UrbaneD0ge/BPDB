<script>
    import { onMount } from 'svelte';
    import Peanut from "$lib/Peanut.svelte";
    import { MediaQuery } from 'svelte/reactivity';

    const large = new MediaQuery('min-width: 1024px');
    // $inspect(large.current, "large");

    const DEFAULT_FILL_HEX = "#a38226";
    const DEFAULT_STROKE_HEX = "#765d1f";

    let fillHex = $state(DEFAULT_FILL_HEX);
    let strokeHex = $state(DEFAULT_STROKE_HEX);

    onMount(() => {
        const savedFillHex = localStorage.getItem('fillHex');
        const savedStrokeHex = localStorage.getItem('strokeHex');
        if (savedFillHex) fillHex = savedFillHex;
        if (savedStrokeHex) strokeHex = savedStrokeHex;
    });

    const saveColors = () => {
        // Persist colors and notify layout in the same tab immediately.
        localStorage.setItem('fillHex', fillHex);
        localStorage.setItem('strokeHex', strokeHex);
        window.dispatchEvent(new CustomEvent('peanut-colors-changed', {
            detail: { fillHex, strokeHex }
        }));
    };

    const resetColors = () => {
        fillHex = DEFAULT_FILL_HEX;
        strokeHex = DEFAULT_STROKE_HEX;
        // saveColors();
    };

    const swapColors = () => {
        const temp = fillHex;
        fillHex = strokeHex;
        strokeHex = temp;
        // saveColors();
    };
</script>

<main class="h-svh flex flex-col justify-start items-center gap-4 font-rounded-regular px-2 py-2 lg:px-8 lg:py-12">

    <form class="flex flex-col text-white gap-4 lg:gap-4 justify-start items-center m-0! z-10">
    <div>
        <h1>Peanut Picker</h1>
        <p>Make the peanut your own! Design your own peanut to live at the top of the page on this device. You can always come back and change it later.</p>
    </div>

    <div class="flex flex-row gap-4 justify-center items-center">
        <input
        type="color"
        class="color-picker"
        id="foreground"
        name="foreground"
        bind:value={strokeHex} />
    <label for="foreground">Stroke color</label>

        <button type="button" class="bg-black text-white hover:bg-white hover:text-black p-2 rounded-lg" onclick={swapColors}>Swap</button>

    <input
        type="color"
        class="color-picker"
        id="background"
        name="background"
        bind:value={fillHex}
        colorspace="limited-srgb"
        alpha />
    <label for="background">Fill color</label>
    </div>

    <div class="flex flex-row gap-4 justify-center items-center">
        <button type="button" class="bg-gray-900 text-white p-2 rounded-lg" onclick={resetColors}>Reset</button>

        <button type="button" class="bg-white text-black p-2 rounded-lg" onclick={saveColors}>Save</button>
    </div>

    </form>

    <div id="peanut-container" class="flex justify-center items-center top-[60svh] lg:top-[35svh]">
        <Peanut id="peanut" size={large.current ? 150 : 75} clipHeight={100} rotation={45} {fillHex} {strokeHex} disableHoverEffects={true} />
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