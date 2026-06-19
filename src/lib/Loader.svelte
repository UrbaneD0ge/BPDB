<script>
  import { fade } from 'svelte/transition';
  // import peanutglobe from '/peanutglobe.svg';
</script>

<div class="loader" transition:fade>
  <img src="/peanutglobe.svg" alt="Loading" />
</div>

<style>
  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
  }

  .loader img {
    src: url('/peanutglobe.svg');
    width: 30px;
    height: 30px;
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