<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelDefinitions: {
    type: Array,
    default: () => [
      { ramMin: 64, vramMin: 16, models: [{"Qwen3 Coder 30B A3B Instruct": { parameters: 30, quantization: 'BF16' }}], usefulness: 1.0},
      { ramMin: 32, vramMin: 16, models: [{"Qwen3 Coder 30B A3B Instruct": { parameters: 30, quantization: 'Q8_0' }}], usefulness: 0.7},
      { ramMin: 32, vramMin: 6, models: [{"Qwen3 Coder 30B A3B Instruct": { parameters: 30, quantization: 'Q6_K_M' }}], usefulness: 0.5},
      { ramMin: 16, vramMin: 4, models: [{"Qwen3 4B Instruct 2507": { parameters: 4, quantization: 'F16' }}], usefulness: 0.3},
    ]
  },
  ramOptions: {
    type: Array,
    default: () => [16, 32, 64, 128]
  },
  vramOptions: {
    type: Array,
    default: () => [0, 4, 6, 8, 12, 16, 24, 32]
  }
})

const ram = ref(16)
const vram = ref(8)
// New context size state - default to 16k
const contextSize = ref(16384)

// Use the prop for recommendation rules
const recommendationRules = computed(() => props.modelDefinitions)

const recommendedModel = computed(() => {
  // Find the first rule that matches the current RAM and VRAM
  const matchingRule = recommendationRules.value.find(rule => ram.value >= rule.ramMin && vram.value >= rule.vramMin)
  
  if (matchingRule) {
    // Extract the model name and details from the models array
    const modelEntry = matchingRule.models[0]
    const modelName = Object.keys(modelEntry)[0]
    const modelDetails = modelEntry[modelName]
    
    // Calculate border color based on usefulness
    const borderColor = calculateBorderColor(matchingRule.usefulness)
    
    return {
      model: modelName,
      details: modelDetails,
      usefulness: matchingRule.usefulness,
      borderColor,
      // Keep text and background readable
      color: 'var(--vp-c-text-1)', // High contrast text
      bg: 'var(--vp-c-bg-soft)',   // Soft background that works with theme
      hasGlow: matchingRule.usefulness === 1.0 ||matchingRule.usefulness === 0.0 // Add glow for 100% usefulness
    }
  }
  
  return {
    model: 'Not recommended',
    details: null,
    usefulness: 0,
    borderColor: 'var(--vp-c-red-2)',
    color: 'var(--vp-c-text-3)',
    bg: 'var(--vp-c-bg-soft)',
    hasGlow: true // Red glow for no matching model
  }
})

// Function to calculate border color based on usefulness
function calculateBorderColor(usefulness) {
  // Ensure usefulness is between 0 and 1
  const clampedUsefulness = Math.max(0, Math.min(1, usefulness))
  
  let borderColor
  
  if (clampedUsefulness === 1.0) {
    // Special handling for 1.0 usefulness - bright green border
    borderColor = 'var(--vp-c-green-2)'
  } else if (clampedUsefulness === 0) {
    // Special handling for 0.0 usefulness - red border for not recommended
    borderColor = 'var(--vp-c-red-2)'
  } else {
    // Interpolate between red (0) -> yellow (0.5) -> green (1)
    if (clampedUsefulness < 0.5) {
      // Red to yellow transition
      const ratio = clampedUsefulness * 2 // 0 to 1 between red and yellow
      
      // Calculate RGB values
      const r = 255
      const g = Math.round(204 * ratio) // 0 to 204 (yellow's green component)
      const b = 0
      borderColor = `rgb(${r}, ${g}, ${b})`
    } else {
      // Yellow to green transition
      const ratio = (clampedUsefulness - 0.5) * 2 // 0 to 1 between yellow and green
      
      // Calculate RGB values
      const r = Math.round(255 * (1 - ratio)) // 255 to 0 (red component decreases)
      const g = Math.round(204 + (51 * ratio)) // 204 to 255 (green component increases)
      const b = 0
      borderColor = `rgb(${r}, ${g}, ${b})`
    }
  }
  
  return borderColor
}

const isRecommended = computed(() => {
  return recommendedModel.value.model !== 'Not recommended'
})

const selectorClass = computed(() => {
  if (!isRecommended.value) return { 'not-recommended': true }
  return {}
})

const modelNameClasses = computed(() => {
  if (!isRecommended.value) return { 'not-recommended': true }
  return {}
})

// Calculate quantization level from quantization string
function getQuantizationLevel(quantization) {
  if (quantization.includes('BF16') || quantization.includes('F16')) return 16
  if (quantization.includes('Q8')) return 8
  if (quantization.includes('Q6')) return 6
  if (quantization.includes('Q5')) return 5
  if (quantization.includes('Q4')) return 4
  if (quantization.includes('Q3')) return 3
  if (quantization.includes('Q2')) return 2
  if (quantization.includes('Q1')) return 1
  return 0 // default to 0 if not recognized
}

// Calculate file size based on parameters and quantization
function calculateFileSize(paramsB, quantization, addContext = true) {
  const quantLevel = getQuantizationLevel(quantization)
  let totalFileSizeInGB = paramsB * (quantLevel / 8) // divide by 8 for "bytes"
  // Replace the fixed 3GB context size overhead with dynamic calculation
  if (addContext)
    totalFileSizeInGB = totalFileSizeInGB + calculateContextOverhead()
  return totalFileSizeInGB
}

// Calculate context overhead based on context size
function calculateContextOverhead() {
  // Start at 4K = 1GB overhead
  const baseContext = 4096
  const baseOverhead = 1
  
  // Calculate how many steps we are from the base
  let currentSize = baseContext
  let overhead = baseOverhead
  
  while (currentSize < contextSize.value) {
    currentSize *= 1.33
    overhead *= 1.33
  }
  
  return overhead
}

// Calculate Windows overhead
function calculateWindowsOverhead(ramSize) {
  if (ramSize >= 64) return 16
  if (ramSize >= 32) return 12
  if (ramSize >= 16) return 8
  return 0
}

// Memory bar calculations
const ramWindowsOverhead = computed(() => calculateWindowsOverhead(ram.value))
const ramModelSize = computed(() => {
  if (!recommendedModel.value.details) return 0
  return calculateFileSize(recommendedModel.value.details.parameters, recommendedModel.value.details.quantization, false)
})

// Calculate context overhead separately for display
const ramContextOverhead = computed(() => {
  if (!recommendedModel.value.details) return 0
  return calculateContextOverhead()
})

const ramLeftover = computed(() => {
  const used = ramWindowsOverhead.value + ramModelSize.value
  return Math.max(0, ram.value - used)
})

const vramWindowsOverhead = computed(() => 1) // Fixed 1GB VRAM overhead
const vramModelSize = computed(() => {
  if (!recommendedModel.value.details) return 0
  return calculateFileSize(recommendedModel.value.details.parameters, recommendedModel.value.details.quantization)
})

// Calculate VRAM context overhead separately for display
const vramContextOverhead = computed(() => {
  if (!recommendedModel.value.details) return 0
  return calculateContextOverhead()
})

const vramLeftover = computed(() => {
  const used = vramWindowsOverhead.value + vramModelSize.value
  return Math.max(0, vram.value - used)
})

// Memory bar styles - updated to show context overhead separately
const ramBarStyle = computed(() => {
  const total = ram.value
  const winPercent = (ramWindowsOverhead.value / total) * 100
  const modelPercent = (ramModelSize.value / total) * 100
  const leftoverPercent = (ramLeftover.value / total) * 100
  
  return {
    background: `linear-gradient(
      to right,
      var(--vp-c-blue-2) ${winPercent}%,
      var(--vp-c-orange-2) ${winPercent}% ${winPercent + modelPercent}%,
      var(--vp-c-gray-3) ${winPercent + modelPercent}% ${winPercent + modelPercent + leftoverPercent}%
    )`,
    height: '20px',
    borderRadius: '4px',
    width: '100%'
  }
})

const vramBarStyle = computed(() => {
  const total = vram.value
  const winPercent = (vramWindowsOverhead.value / total) * 100
  const modelPercent = (vramModelSize.value / total) * 100
  const leftoverPercent = (vramLeftover.value / total) * 100
  
  return {
    background: `linear-gradient(
      to right,
      var(--vp-c-blue-2) ${winPercent}%,
      var(--vp-c-orange-2) ${winPercent}% ${winPercent + modelPercent}%,
      var(--vp-c-gray-3) ${winPercent + modelPercent}% ${winPercent + modelPercent + leftoverPercent}%
    )`,
    height: '20px',
    borderRadius: '4px',
    width: '100%'
  }
})

// Legend for memory bars - updated to include context overhead
const legendItems = [
  { label: 'Windows Overhead', color: 'var(--vp-c-blue-2)' },
  { label: 'Model Size', color: 'var(--vp-c-orange-2)' },
  { label: 'Available', color: 'var(--vp-c-gray-3)' }
]
// Context size options for the slider
const contextSizeOptions = computed(() => {
  const multipliers = [1, 2, 4, 8, 12, 16, 22, 28, 32];
  return multipliers.map(mult => mult * 1024);
});


// Function to get the index of the current context size in the options
const contextSizeIndex = computed({
  get() {
    // Find the index closest to the current contextSize value
    let closestIndex = 0;
    let smallestDiff = Math.abs(contextSizeOptions.value[0] - contextSize.value);
    
    for (let i = 1; i < contextSizeOptions.value.length; i++) {
      const diff = Math.abs(contextSizeOptions.value[i] - contextSize.value);
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestIndex = i;
      }
    }
    return closestIndex;
  },
  set(index) {
    // Ensure index is within bounds
    const safeIndex = Math.max(0, Math.min(index, contextSizeOptions.value.length - 1));
    contextSize.value = contextSizeOptions.value[safeIndex];
  }
})
</script>

<style module>
.modelSelector {
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 16px;
  background-color: var(--vp-code-block-bg);
  border: 2px solid var(--vp-c-border); /* Default border */
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden; /* Ensures background colors stay within bounds */
}

.modelSelector::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--vp-c-brand), var(--vp-c-green));
  /* Default gradient, will be overridden by JavaScript or specific class if needed */
}

/* Example: Specific border color based on recommendation */
.modelSelectorRecommendedSuccess {
  border-color: var(--vp-c-green-2);
}
.modelSelectorRecommendedCaution {
  border-color: var(--vp-c-yellow-2);
}
.modelSelectorRecommendedWarning {
  border-color: var(--vp-c-orange-2);
}
.modelSelectorRecommended4b {
  border-color: var(--vp-c-purple-2);
}

.modelSelectorGlow {
  box-shadow: 0 0 15px rgba(72, 187, 120, 0.5) !important; /* Green glow for 100% */
}

.modelSelectorNoMatch {
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.5) !important; /* Red glow for no match */
}

.h3 {
  margin-top: 0;
  margin-bottom: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.controlGroup {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.controlGroupLabel {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
}

.controlGroupSelect {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.controlGroupSelect:hover {
  border-color: var(--vp-c-brand-lighter);
}

.controlGroupSelect:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.25);
}

/* New styles for context size control */
.contextControlGroup {
  display: flex;
  flex-direction: column;
  min-width: 250px;
  flex: 1;
}

.contextControlLabel {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
}

.contextSliderContainer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.contextSliderWrapper {
  flex: 1;
  position: relative;
}

.contextSlider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--vp-c-divider);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}
/* Adjusted styles for the context size slider thumb */
.contextSlider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%; /* Ensure it's a circle */
  background: var(--vp-c-brand);
  cursor: pointer;
  transition: all 0.2s ease; /* Smooth transition for transform and other props */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3),
              0 0 0 1px var(--vp-c-brand); /* Optional: Add a subtle border to define the thumb more clearly */
  /* Ensure it renders correctly during transform */
  backface-visibility: hidden; /* Optimizes rendering during transform */
  /* Optional: Ensure it sits above other elements if needed */
  /* z-index: 1; /* z-index doesn't work on pseudo-elements like ::-webkit-slider-thumb, so this won't help directly */
}

.contextSlider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%; /* Ensure it's a circle */
  background: var(--vp-c-brand);
  cursor: pointer;
  border: none; /* Ensure no default border interferes */
  transition: all 0.2s ease; /* Smooth transition for transform and other props */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3),
              0 0 0 1px var(--vp-c-brand); /* Optional: Add a subtle border */
  /* Ensure it renders correctly during transform */
  backface-visibility: hidden; /* Optimizes rendering during transform */
}

.contextValueDisplay {
  min-width: 80px;
  text-align: center;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.9em;
  font-weight: 500;
  border: 1px solid var(--vp-c-border);
  flex-shrink: 0;
}

.result {
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.resultStrong {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.modelName {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.95em;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid transparent; /* Default border */
}

.modelNameNotRecommended {
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-text-3);
  font-style: italic;
}

/* Dynamically applied styles based on recommendation level */
.modelNameRecommendedSuccess {
  background-color: var(--vp-c-green-soft);
  color: var(--vp-c-green-2);
  border-color: var(--vp-c-green-2);
}
 
.modelNameRecommendedCaution {
  background-color: var(--vp-c-yellow-soft);
  color: var(--vp-c-yellow-2);
  border-color: var(--vp-c-yellow-2);
}
 
.modelNameRecommendedWarning {
  background-color: var(--vp-c-orange-soft);
  color: var(--vp-c-orange-2);
  border-color: var(--vp-c-orange-2);
}
 
.modelNameRecommended4b {
  background-color: var(--vp-c-purple-soft);
  color: var(--vp-c-purple-2);
  border-color: var(--vp-c-purple-2);
}

.modelNameGlow {
  box-shadow: 0 0 8px rgba(72, 187, 120, 0.4) !important; /* Green glow for 100% */
}

.modelNameNoMatch {
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4) !important; /* Red glow for no match */
}

.details {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.memorySection {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.memoryBarContainer {
  margin-top: 0.5rem;
}

.memoryBarLabel {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.legend {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.legendItem {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.legendColor {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.contextDetails {
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.contextDetails strong {
  color: var(--vp-c-text-1);
}
</style>

<template>
<div 
  :class="[$style.modelSelector, 
           selectorClass['recommendedSuccess'] ? $style.modelSelectorRecommendedSuccess : '',
           selectorClass['recommendedCaution'] ? $style.modelSelectorRecommendedCaution : '',
           selectorClass['recommendedWarning'] ? $style.modelSelectorRecommendedWarning : '',
           selectorClass['recommended4b'] ? $style.modelSelectorRecommended4b : '',
           selectorClass['not-recommended'] ? $style.modelSelectorNotRecommended : '',
           recommendedModel.hasGlow && recommendedModel.usefulness === 1.0 ? $style.modelSelectorGlow : '',
           recommendedModel.hasGlow && recommendedModel.usefulness === 0 ? $style.modelSelectorNoMatch : '']"
  :style="{ borderColor: recommendedModel.borderColor }">
  <div :class="$style.controls">
    <div :class="$style.controlGroup">
      <label :for="`ram-select-${Math.random()}`" :class="$style.controlGroupLabel">RAM (GB)</label>
      <select :id="`ram-select-${Math.random()}`" v-model.number="ram" :class="$style.controlGroupSelect">
        <option v-for="r in props.ramOptions" :key="r" :value="r">{{ r }}</option>
      </select>
    </div>
    <div :class="$style.controlGroup">
      <label :for="`vram-select-${Math.random()}`" :class="$style.controlGroupLabel">VRAM (GB)</label>
      <select :id="`vram-select-${Math.random()}`" v-model.number="vram" :class="$style.controlGroupSelect">
        <option v-for="v in props.vramOptions" :key="v" :value="v">{{ v }}</option>
      </select>
    </div>
    <!-- New context size control -->
    <div :class="$style.contextControlGroup">
      <label :class="$style.contextControlLabel">Context Size: {{ contextSize }} tokens</label>
      <div :class="$style.contextSliderContainer">
        <div :class="$style.contextSliderWrapper">
          <input 
            type="range" 
            :min="0" 
            :max="contextSizeOptions.length - 1" 
            v-model.number="contextSizeIndex"
            :class="$style.contextSlider"
          />
        </div>
      </div>
    </div>
  </div>

  <div :class="$style.result">
    <strong :class="$style.resultStrong">Recommended model:</strong>
    <span
      :class="[$style.modelName,
               modelNameClasses['recommendedSuccess'] ? $style.modelNameRecommendedSuccess : '',
               modelNameClasses['recommendedCaution'] ? $style.modelNameRecommendedCaution : '',
               modelNameClasses['recommendedWarning'] ? $style.modelNameRecommendedWarning : '',
               modelNameClasses['recommended4b'] ? $style.modelNameRecommended4b : '',
               modelNameClasses['not-recommended'] ? $style.modelNameNotRecommended : '',
               recommendedModel.hasGlow && recommendedModel.usefulness === 1.0 ? $style.modelNameGlow : '',
               recommendedModel.hasGlow && recommendedModel.usefulness === 0 ? $style.modelNameNoMatch : '']"
      :style="{ backgroundColor: recommendedModel.bg, color: recommendedModel.color, borderColor: recommendedModel.borderColor }"
    >
      {{ recommendedModel.model }}
    </span>
    <div v-if="recommendedModel.details" :class="$style.details">
      <small>Parameters: {{ recommendedModel.details.parameters }}B | Quantization: {{ recommendedModel.details.quantization.toUpperCase() }}</small>
    </div>
  </div>

  <!-- Context overhead details -->
  <div v-if="recommendedModel.details" :class="$style.contextDetails">
    <strong>Context Overhead:</strong> {{ ramContextOverhead.toFixed(2) }}GB (based on {{ contextSize.toLocaleString() }} token context)
  </div>

  <!-- Memory bars section -->
  <div v-if="recommendedModel.details" :class="$style.memorySection">
    <div :class="$style.memoryBarContainer">
      <div :class="$style.memoryBarLabel">
        <span>RAM Usage</span>
        <span>{{ ramWindowsOverhead }}GB (Overhead) + {{ ramModelSize.toFixed(1) }}GB (Model) = {{ (ramWindowsOverhead + ramModelSize).toFixed(1) }}GB / {{ ram.toFixed(1) }}GB</span>
      </div>
      <div :style="ramBarStyle"></div>
    </div>

    <div :class="$style.memoryBarContainer">
      <div :class="$style.memoryBarLabel">
        <span>VRAM Usage</span>
        <span>{{ vramWindowsOverhead }}GB (Overhead) + {{ vramModelSize.toFixed(1) }}GB (Model + Context) = {{ (vramWindowsOverhead + vramModelSize).toFixed(1) }}GB / {{ vram.toFixed(1) }}GB</span>
      </div>
      <div :style="vramBarStyle"></div>
    </div>

    <div :class="$style.legend">
      <div v-for="item in legendItems" :key="item.label" :class="$style.legendItem">
        <div :class="$style.legendColor" :style="{ backgroundColor: item.color }"></div>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</div>
</template>