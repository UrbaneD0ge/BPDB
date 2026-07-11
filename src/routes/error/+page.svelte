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
</script>

<main class="h-svh flex flex-col justify-center items-center gap-4 font-rounded-regular px-2 py-2 lg:px-8 lg:py-12">

    <h1 class="text-white text-4xl font-rounded-extrabold">Nuts! Something went wrong.</h1>
    <p class="text-white text-2xl">The page you are looking for does not exist or has been removed.<br>Please check the URL or return to the <a href="/" class="text-green-500 hover:underline">home page</a>.</p>

</main>

