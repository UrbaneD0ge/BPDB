<script>
import Peanut from '$lib/Peanut.svelte';
import Info from '$lib/Info.svelte';

let {
  title = 'temp',
  name = 'temp',
  message = '',
  min = 1,
  max = 10,
  step = 1,
  value = 1,
  color = 'green',
  id = 'temp'
} = $props();

let sliderValue = $derived(Number(value));

$effect(() => {
  sliderValue = Number(value);
});

const thumbPercent = $derived.by(() => {
  const minValue = Number(min);
  const maxValue = Number(max);
  const currentValue = Number(sliderValue);
  const range = maxValue - minValue;

  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue) || !Number.isFinite(currentValue) || range <= 0) {
    return 0;
  }

  return ((currentValue - minValue) / range) * 100;
});

</script>

<div class="slider-header">
  <label class="text-white lg:text-2xl" for={name}>{title}:</label>
  <Info message={message} />
</div>

<div class="slider-wrap">
  <div class="range-wrap">
    <input
      class="accent-{color}-600"
      type="range"
      id={name}
      name={name}
      list="markers-list"
      min={min}
      max={max}
      step={step}
      bind:value={sliderValue}
    />
    <div class="thumb" style={`left: clamp(0.75rem, ${thumbPercent}%, calc(100% - 0.75rem));`} aria-hidden="true">
      <Peanut size={12} clipHeight={sliderValue * 10} rotation={45} disableHoverEffects={true} strokeHex="#000" fillHex="#ffd300" />
    </div>
  </div>
</div>

<datalist id="markers-list" class="font-rounded-extrabold">
  <option value="1" label="1"></option>
  <option value="2" label="2"></option>
  <option value="3" label="3"></option>
  <option value="4" label="4"></option>
  <option value="5" label="5"></option>
  <option value="6" label="6"></option>
  <option value="7" label="7"></option>
  <option value="8" label="8"></option>
  <option value="9" label="9"></option>
  <option value="10" label="10"></option>
</datalist>

<style>
datalist {
  width: 90%;
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  color: white;
}

.slider-wrap {
  width: 90%;
  margin: 1rem auto;
}

.slider-header {
  width: 90%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.range-wrap {
  position: relative;
}

.thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 2;
}

input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  color: white;
  width: 100%;
  display: block;
  margin: 0;
  height: 1rem;
  background: linear-gradient(to right, #96a699 0%, #22c55e 100%);
  border-radius: 1rem;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 0;
  height: 0;
  border: none;
  background: transparent;
}

input[type="range"]::-moz-range-thumb {
  width: 0;
  height: 0;
  border: none;
  background: transparent;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 1rem;
  cursor: pointer;
  border-radius: 0.25rem;
}
input[type="range"]::-moz-range-track {
  width: 100%;
  height: 1rem;
  cursor: pointer;
  border-radius: 0.25rem;
}
</style>