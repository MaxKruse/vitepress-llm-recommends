<script setup>
import { ref, computed } from 'vue'

// Add model mapping for LMStudio URIs
const modelToHfMapping = {
  "Qwen3 4B Instruct 2507": "unsloth/Qwen3-4B-Instruct-2507-GGUF",
  "Qwen3 4B Thinking 2507": "unsloth/Qwen3-4B-Thinking-2507-GGUF",
  "Qwen3 30B Instruct 2507": "unsloth/Qwen3-30B-A3B-Instruct-2507-GGUF",
  "Qwen3 30B Thinking 2507": "unsloth/Qwen3-30B-A3B-Thinking-2507-GGUF",
  "Qwen3 Coder 30B A3B Instruct": "unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF",
  "Mistral Small 3.2": "unsloth/Mistral-Small-3.2-24B-Instruct-2506-GGUF",
  "GPT OSS 20B": "openai/gpt-oss-20b",
  "GPT OSS 120B": "openai/gpt-oss-120b",
  "Gemma 3 12B": "unsloth/gemma-3-12b-it-GGUF",
  "Gemma 3 27B": "unsloth/gemma-3-27b-it-GGUF",
  "GLM 4.7 Flash": "unsloth/GLM-4.7-Flash-GGUF",
  "Qwen3 Coder Next": "unsloth/Qwen3-Coder-Next-GGUF",
};

// Function to get LMStudio URI
const getLmstudioUri = computed(() => {
  if (!recommendedModel.value.details) return null;
  
  const modelName = recommendedModel.value.model;
  const hfPath = modelToHfMapping[modelName];
  
  if (!hfPath) return null;
  
  const [uploader, model] = hfPath.split('/');
  return `lmstudio://open_from_hf?model=${uploader}/${model}`;
});

const props = defineProps({
  modelDefinitions: {
    type: Array,
    default: () => [
      { ramMin: 64, vramMin: 16, models: [{"Qwen3 Coder 30B A3B Instruct": { parameters: 30, quantization: 'BF16' }}], usefulness: 1.0},
      { ramMin: 32, vramMin: 16, models: [{"Qwen3 Coder 30B A3B Instruct": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.7},
      { ramMin: 32, vramMin: 6, models: [{"Qwen3 Coder 30B A3B Instruct": { parameters: 30, quantization: 'Q6_K_XL' }}], usefulness: 0.5},
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
  },
  contextSize: {
    type: Number,
    default: () => 1024*8
  }
})

const ram = ref(16)
const vram = ref(8)

const contextSize = computed(() => props.contextSize)

// Use the prop for recommendation rules
const recommendationRules = computed(() => props.modelDefinitions)

const recommendedModel = computed(() => {
  // Find the first rule that matches the current RAM and VRAM
  const matchingRule = recommendationRules.value.find(rule => ram.value >= rule.ramMin && vram.value >= rule.vramMin)
  
  if (matchingRule) {
    // Build a normalized list of model entries: { name, details }
    const modelEntries = matchingRule.models.map(m => {
      const name = Object.keys(m)[0]
      const details = m[name]
      return { name, details }
    })

    // Helper to format a model entry exactly as "{name} {parameters}B ({quantization})"
    // If parameters or quantization are missing, fall back to "{name} (unknown)"
    function formatModelEntry(name, details) {
      const hasParams = details && typeof details.parameters === 'number'
      const quant = details?.quantization
      if (!hasParams || !quant) return `${name} (unknown)`

      const match = name.match(/\d+B/); // Only one expected match

      if (!match) {
        return `${name} ${details.parameters}B (${quant})`
      }

      return `${name} (${quant})`
    }

    // Respect author-defined priority: the first model in the matching rule is the primary recommendation.
    const chosen = modelEntries[0] || { name: 'Unknown', details: null }

    // Calculate border color based on usefulness
    const borderColor = calculateBorderColor(matchingRule.usefulness)
    
    // Build plausibleModels: formatted strings for every model in the matching rule EXCLUDING the first choice
    const plausibleModels = modelEntries
      .slice(1)
      .map(e => formatModelEntry(e.name, e.details))

    return {
      // Keep 'model' and 'details' pointing to the first-priority model
      model: chosen.name,
      // Provide a formatted display string for the primary model for template use
      formattedModel: formatModelEntry(chosen.name, chosen.details),
      // plausibleModels is an array of formatted strings (other models only)
      plausibleModels,
      details: chosen.details,
      usefulness: matchingRule.usefulness,
      borderColor,
      // Keep text and background readable
      color: 'var(--vp-c-text-1)', // High contrast text
      bg: 'var(--vp-c-bg-soft)',   // Soft background that works with theme
      hasGlow: matchingRule.usefulness === 1.0 || matchingRule.usefulness === 0.0 // Add glow for 100% usefulness
    }
  }
  
  return {
    model: 'Not recommended',
    formattedModel: 'Not recommended',
    plausibleModels: [],
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

// Fixed selectorClass computed property - now properly maps usefulness to CSS classes
const selectorClass = computed(() => {
  if (!isRecommended.value) return { 'notRecommended': true }
  if (recommendedModel.value.usefulness === 1.0) return { 'recommendedSuccess': true }
  if (recommendedModel.value.usefulness >= 0.5) return { 'recommendedCaution': true }
  return { 'recommendedWarning': true }
})

// Fixed modelNameClasses computed property
const modelNameClasses = computed(() => {
  if (!isRecommended.value) return { 'notRecommended': true }
  if (recommendedModel.value.usefulness === 1.0) return { 'recommendedSuccess': true }
  if (recommendedModel.value.usefulness >= 0.5) return { 'recommendedCaution': true }
  return { 'recommendedWarning': true }
})

// Calculate quantization level from quantization string
function getQuantizationLevel(quantization) {
  if (!quantization || typeof quantization !== 'string') {
    return 0.0;
  }

  if (quantization.includes('BF16') || quantization.includes('F16')) {
    return 16.0;
  }

  // Support common GGUF quant names, e.g. Q4_K_M, Q6_K_XL, Q8_0.
  // We use the numeric Q-level and apply a small overhead multiplier.
  const qMatch = quantization.match(/Q(\d+(?:\.\d+)?)/i);
  if (qMatch) {
    const baseValue = parseFloat(qMatch[1]);
    return parseFloat(baseValue * 1.2);
  }

  const fpMatch = quantization.match(/\w+FP([1-8])/);
  if (fpMatch) {
    const baseValue = parseInt(fpMatch[1], 10);
    return parseFloat(baseValue * 1.2); 
  }
  
  return 0.0; // default to 0 if not recognized
}

// Calculate file size based on parameters and quantization
// Vision adapter constant: some models ship an extra vision-adapter
// which is part of the model weights (not context overhead) and must be added
function VisionAdapterSize(modelName) {
  if (/mistral\s*small/i.test(modelName)) {
    return 0.9
  }

  if (/gemma\s*3/i.test(modelName)) {
    return 0.9;
  }

  if (/qwen3\s*vl/i.test(modelName)) {
    return 1.3;
  };

  return 0;
}

// Helper: detect models that include a vision adapter (Mistral Small 3.2 family, Gemma 3 family)
function hasVisionAdapter(modelName) {
  if (!modelName) return false
  // Match "Mistral Small 3.2" family (case-insensitive) and "Gemma 3" family
  return /mistral\s*small/i.test(modelName) || /gemma\s*3/i.test(modelName) || /qwen3\s*vl/i.test(modelName)
}

function calculateFileSize(paramsB, quantization, addContext = true, modelName = '') {
  const quantLevel = getQuantizationLevel(quantization)
  let totalFileSizeInGB = paramsB * (quantLevel / 8.0) // divide by 8 for "bytes"

  // Add vision adapter size to model weights when model requires it.
  // This is applied regardless of addContext because it's part of the model weights.
  if (hasVisionAdapter(modelName)) {
    totalFileSizeInGB += VisionAdapterSize(modelName)
  }

  // Replace the fixed 3GB context size overhead with dynamic calculation
  if (addContext)
    totalFileSizeInGB = totalFileSizeInGB + calculateContextOverhead(modelName)
  return totalFileSizeInGB
}

// Qwen3 Next and Qwen3.5 families use linear (flat) context-memory scaling.
function hasLinearContextScaling(modelName) {
  if (!modelName) return false
  return /qwen\s*3.*next/i.test(modelName) || /qwen\s*3\.5/i.test(modelName)
}

// Calculate context overhead based on context size and model family.
function calculateContextOverhead(modelName = '') {
  if (hasLinearContextScaling(modelName)) {
    // Linear scaling target requested by user:
    // 32k -> 1GB, 64k -> 2GB, 128k -> 4GB
    return contextSize.value / (32 * 1024)
  }

  // Normal scaling baseline: start at 4K = 0.25GB overhead
  const baseContext = 4096
  const baseOverhead = 0.25
  
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

// Core computed sizes (model weights only, context overhead, windows overhead)
const modelSizeGB = computed(() => {
  if (!recommendedModel.value.details) return 0
  // Pass recommendedModel.value.model so the modelSize includes any vision-adapter weight
  return calculateFileSize(
    recommendedModel.value.details.parameters,
    recommendedModel.value.details.quantization,
    false,
    recommendedModel.value.model
  ) * 1.024 // extra padding for 1000 vs 1024 based...
})
const contextSizeGB = computed(() => calculateContextOverhead(recommendedModel.value.model))

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

/* Fixed: Added proper CSS classes that match computed properties */
.modelSelectorRecommendedSuccess {
  border-color: var(--vp-c-green-2);
}
.modelSelectorRecommendedCaution {
  border-color: var(--vp-c-yellow-2);
}
.modelSelectorRecommendedWarning {
  border-color: var(--vp-c-orange-2);
}
.modelSelectorNotRecommended {
  border-color: var(--vp-c-red-2);
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

/* Red warning box shown when RAM or VRAM math exceeds totals */
.memoryWarningBox {
  border: 2px solid var(--vp-c-red-2);
  background: rgba(239, 68, 68, 0.04); /* subtle red tint */
  padding: 0.5rem;
  border-radius: 8px;
}

/* Compact memory table styles */
.memoryTable {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.85rem;
}

.memoryTable th,
.memoryTable td {
  padding: 0.5rem;
  text-align: center;
  border: 1px solid var(--vp-c-divider);
}

.memoryTable th {
  background-color: var(--vp-c-bg-soft);
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.memoryTable tr:first-child th {
  border-top: none;
}

.memoryTable tr:last-child td {
  border-bottom: none;
}

.memoryTable tr td:first-child,
.memoryTable tr th:first-child {
  border-left: none;
}

.memoryTable tr td:last-child,
.memoryTable tr th:last-child {
  border-right: none;
}

.memoryTable .memory-type-header {
  font-weight: 600;
  background-color: var(--vp-c-bg-soft);
  width: 60px;
}

.memoryTable .memory-value {
  font-family: var(--vp-font-family-mono);
  font-weight: 500;
}

.memoryTable .memory-value.warning {
  color: var(--vp-c-red-2);
}

.result {
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  position: relative;
}

.modelContainer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.lmstudioButton {
  float: right;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid var(--vp-c-brand-soft);
  flex-shrink: 0;
}

.lmstudioButton:hover {
  background-color: var(--vp-c-brand-softer);
  color: var(--vp-c-bg-soft);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lmstudioButton:active {
  transform: translateY(0);
}

.contextControlGroup {
  width: 100%;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--vp-c-divider);
}

.contextControlLabel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: var(--vp-c-text-1);
  padding-bottom: 0.25rem;
}

.contextValue {
  background: var(--vp-c-bg-soft);
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.92rem;
  border: 1px solid var(--vp-c-border);
  min-width: 120px;
  text-align: center;
}

</style>

<template>
<div 
  :class="[$style.modelSelector, 
           selectorClass.recommendedSuccess ? $style.modelSelectorRecommendedSuccess : '',
           selectorClass.recommendedCaution ? $style.modelSelectorRecommendedCaution : '',
           selectorClass.recommendedWarning ? $style.modelSelectorRecommendedWarning : '',
           selectorClass.notRecommended ? $style.modelSelectorNotRecommended : '',
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
  </div>


  <div :class="$style.contextControlGroup">
      <label :class="$style.contextControlLabel">
        Assumed Context Size for this usecase:
        <span :class="$style.contextValue">{{ contextSize.toLocaleString() }} tokens</span>
      </label>
    </div>

  <div :class="$style.result">
    <strong :class="$style.resultStrong">Recommended model:</strong>
    <span
      :class="[$style.modelName,
               modelNameClasses.recommendedSuccess ? $style.modelNameRecommendedSuccess : '',
               modelNameClasses.recommendedCaution ? $style.modelNameRecommendedCaution : '',
               modelNameClasses.recommendedWarning ? $style.modelNameRecommendedWarning : '',
               modelNameClasses.notRecommended ? $style.modelNameNotRecommended : '',
               recommendedModel.hasGlow && recommendedModel.usefulness === 1.0 ? $style.modelNameGlow : '',
               recommendedModel.hasGlow && recommendedModel.usefulness === 0 ? $style.modelNameNoMatch : '']"
      :style="{ backgroundColor: recommendedModel.bg, color: recommendedModel.color, borderColor: recommendedModel.borderColor }"
    >
      {{ recommendedModel.formattedModel || recommendedModel.model }} <span v-if="hasVisionAdapter(recommendedModel.formattedModel)" style="font-weight: bolder; background-color: rgba(250, 250, 0, 0.5);">(includes Vision)</span>
    </span>

    <!-- LMStudio button -->
      <template v-if="getLmstudioUri">
        <a 
          :href="getLmstudioUri" 
          target="_blank" 
          :class="$style.lmstudioButton"
        >
          Use in LMStudio
        </a>
      </template>

    <div v-if="recommendedModel.plausibleModels && recommendedModel.plausibleModels.length > 0" :class="$style.details">
      <small>Also considered: {{ recommendedModel.plausibleModels.join(', ') }}</small>
    </div>
    <div v-if="recommendedModel.details" :class="$style.details">
      <small>
        Parameters: {{ recommendedModel.details.parameters ? recommendedModel.details.parameters + 'B' : '(unknown)' }} |
        Quantization: {{ recommendedModel.details.quantization ? recommendedModel.details.quantization.toUpperCase() : '(unknown)' }} |
        Model Memory Impact: {{ modelSizeGB.toFixed(1) }} GB
      </small>
    </div>
  </div>

  <!-- Context overhead details -->
  <div v-if="recommendedModel.details" :class="$style.contextDetails">
    <strong>Context Overhead:</strong> {{ contextSizeGB.toFixed(2) }}GB (based on {{ contextSize.toLocaleString() }} token context)
    <br>
    <small>Note: The size of context in GB is an estimate that shows the "worst case". It may be smaller in actual use, but is assumed to be higher for safely assessing upper bounds.</small>
  </div>

</div>
</template>