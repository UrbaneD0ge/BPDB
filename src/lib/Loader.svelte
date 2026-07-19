<script>
  import { fade } from 'svelte/transition';
  import Peanut from '$lib/Peanut.svelte';

  let {fillHex = '#a38226', strokeHex = '#765d1f', size = 8} = $props();
</script>

<div class="loader" transition:fade>
  <Peanut size={size} disableHoverEffects fillHex={fillHex} strokeHex={strokeHex} />
</div>

<style>
  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>