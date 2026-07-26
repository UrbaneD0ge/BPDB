<script>
    import { onMount } from 'svelte';
    import Loader from '$lib/Loader.svelte';

    let {
        show = false,
        size = 40,
        zIndex = 50
    } = $props();

    const DEFAULT_FILL_HEX = '#a38226';
    const DEFAULT_STROKE_HEX = '#765d1f';

    let fillHex = $state(DEFAULT_FILL_HEX);
    let strokeHex = $state(DEFAULT_STROKE_HEX);

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

    const applySavedColors = () => {
        fillHex = normalizeHexColor(localStorage.getItem('fillHex'), DEFAULT_FILL_HEX);
        strokeHex = normalizeHexColor(localStorage.getItem('strokeHex'), DEFAULT_STROKE_HEX);
    };

    onMount(() => {
        applySavedColors();

        const handlePeanutColorsChanged = () => applySavedColors();
        const handleStorage = (event) => {
            if (event.key === 'fillHex' || event.key === 'strokeHex') {
                applySavedColors();
            }
        };

        window.addEventListener('peanut-colors-changed', handlePeanutColorsChanged);
        window.addEventListener('storage', handleStorage);

        return () => {
            window.removeEventListener('peanut-colors-changed', handlePeanutColorsChanged);
            window.removeEventListener('storage', handleStorage);
        };
    });
</script>

{#if show}
    <div
        class="loader-overlay"
        aria-live="polite"
        aria-busy="true"
        style={`z-index: ${zIndex};`}
    >
        <Loader {size} {fillHex} {strokeHex} />
    </div>
{/if}

<style>
    .loader-overlay {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgb(0 0 0 / 0.35);
        backdrop-filter: blur(2px);
    }
</style>
