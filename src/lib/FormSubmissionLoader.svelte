<script>
    import Loader from '$lib/Loader.svelte';

    let {
        show = false,
        size = 40,
        zIndex = 50
    } = $props();
</script>

{#if show}
    <div
        class="loader-overlay"
        aria-live="polite"
        aria-busy="true"
        style={`z-index: ${zIndex};`}
    >
        <Loader {size} />
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
