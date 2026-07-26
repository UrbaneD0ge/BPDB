<script>
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import FormSubmissionLoader from '$lib/FormSubmissionLoader.svelte';
    import Peanut from "$lib/Peanut.svelte";
    import { MediaQuery } from 'svelte/reactivity';

    let { form, data } = $props();

    const large = new MediaQuery('min-width: 1024px');
    // $inspect(large.current, "large");

    const DEFAULT_FILL_HEX = "#a38226";
    const DEFAULT_STROKE_HEX = "#765d1f";

    let fillHex = $state(DEFAULT_FILL_HEX);
    let strokeHex = $state(DEFAULT_STROKE_HEX);
    let isSavingToCloud = $state(false);
    let lastSyncedFillHex = DEFAULT_FILL_HEX;
    let lastSyncedStrokeHex = DEFAULT_STROKE_HEX;
    let lastSavedAt = $state(null);
    let syncIntervalId;

    const normalizeHexColor = (value, fallback = null) => {
        if (typeof value !== 'string') return fallback;
        const trimmed = value.trim().toLowerCase();
        if (/^#[0-9a-f]{6}$/.test(trimmed)) return trimmed;
        if (/^#[0-9a-f]{8}$/.test(trimmed)) return trimmed.slice(0, 7);
        if (/^#[0-9a-f]{3}$/.test(trimmed)) {
            return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`;
        }
        return fallback;
    };

    // $inspect(fillHex, "fillHex");
    // $inspect(strokeHex, "strokeHex");
    // $inspect(form, "form");

    const saveColors = () => {
        fillHex = normalizeHexColor(fillHex, DEFAULT_FILL_HEX);
        strokeHex = normalizeHexColor(strokeHex, DEFAULT_STROKE_HEX);

        // Persist colors and notify layout in the same tab immediately.
        const savedAt = new Date().toISOString();
        localStorage.setItem('fillHex', fillHex);
        localStorage.setItem('strokeHex', strokeHex);
        localStorage.setItem('peanutColorsSavedAt', savedAt);
        lastSavedAt = savedAt;
        window.dispatchEvent(new CustomEvent('peanut-colors-changed', {
            detail: { fillHex, strokeHex }
        }));
    };

    const formatSavedTime = (value) => {
        if (!value) return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return null;
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };

    const syncColorsIfChanged = () => {
        if (fillHex === lastSyncedFillHex && strokeHex === lastSyncedStrokeHex) return;
        saveColors();
        lastSyncedFillHex = fillHex;
        lastSyncedStrokeHex = strokeHex;
    };

    function enhanceCloudSave() {
        isSavingToCloud = true;

        return async ({ result, update }) => {
            try {
                await update({ reset: false });

                if (result?.type === 'success' && result?.data?.success) {
                    const savedFillHex = normalizeHexColor(result.data.fillHex);
                    const savedStrokeHex = normalizeHexColor(result.data.strokeHex);

                    if (savedFillHex) fillHex = savedFillHex;
                    if (savedStrokeHex) strokeHex = savedStrokeHex;

                    syncColorsIfChanged();
                }
            } finally {
                isSavingToCloud = false;
            }
        };
    }

    onMount(() => {
        const dbFillHex = normalizeHexColor(data?.fillHex);
        const dbStrokeHex = normalizeHexColor(data?.strokeHex);
        const hasDbColors = !!dbFillHex && !!dbStrokeHex;
        const savedAtFromStorage = localStorage.getItem('peanutColorsSavedAt');
        if (savedAtFromStorage) {
            lastSavedAt = savedAtFromStorage;
        }

        if (hasDbColors) {
            fillHex = dbFillHex;
            strokeHex = dbStrokeHex;
            saveColors();
        } else {
            const savedFillHex = normalizeHexColor(localStorage.getItem('fillHex'));
            const savedStrokeHex = normalizeHexColor(localStorage.getItem('strokeHex'));
            if (savedFillHex) fillHex = savedFillHex;
            if (savedStrokeHex) strokeHex = savedStrokeHex;
        }

        lastSyncedFillHex = fillHex;
        lastSyncedStrokeHex = strokeHex;
        syncIntervalId = window.setInterval(syncColorsIfChanged, 1200);

        return () => {
            if (syncIntervalId) {
                clearInterval(syncIntervalId);
            }
        };
    });

    const resetColors = () => {
        fillHex = DEFAULT_FILL_HEX;
        strokeHex = DEFAULT_STROKE_HEX;
        syncColorsIfChanged();
    };

    const swapColors = () => {
        const temp = fillHex;
        fillHex = strokeHex;
        strokeHex = temp;
        syncColorsIfChanged();
    };
</script>

<main class="h-svh flex flex-col justify-start items-center gap-4 font-rounded-regular px-2 py-2 lg:px-8 lg:py-12">

    {#if isSavingToCloud}
        <FormSubmissionLoader show={isSavingToCloud} zIndex={1100} />
    {/if}

    <form class="flex flex-col text-white gap-4 lg:gap-4 justify-start items-center m-0! z-10" method="POST" use:enhance={enhanceCloudSave}>
    <div>
        <h1>Peanut Picker</h1>
        <p>Make the peanut your own! Design your own peanut to live at the top of the page on this device. You can always come back and change it later.</p>
    </div>

    <div class="flex flex-row gap-4 justify-center items-center">
        <input
        type="color"
        class="color-picker"
        id="strokeHex"
        name="strokeHex"
        bind:value={strokeHex} />
    <label for="strokeHex">Stroke color</label>

    <input
        type="color"
        class="color-picker"
        id="fillHex"
        name="fillHex"
        bind:value={fillHex} />
    <label for="fillHex">Fill color</label>
    </div>

    <div class="flex flex-row gap-4 justify-center items-center">
        <button type="button" class="bg-gray-900 text-white p-2 rounded-lg" onclick={resetColors}>Reset</button>

                <button type="button" class="bg-black text-white p-2 rounded-lg" onclick={swapColors}>Swap</button>

        <button type="submit" class="bg-white text-black p-2 rounded-lg disabled:opacity-60 disabled:cursor-wait" disabled={isSavingToCloud}>Save</button>
    </div>

    {#if form?.error}
        <p class="m-0 text-sm text-red-300">{form.error}</p>
    {:else if form?.success}
        <p class="m-0 text-sm text-green-300">Saved to cloud.</p>
    {/if}

    {#if formatSavedTime(lastSavedAt)}
        <p class="m-0 text-xs text-gray-300">Saved locally at {formatSavedTime(lastSavedAt)}</p>
    {/if}

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

    button {
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }
</style>