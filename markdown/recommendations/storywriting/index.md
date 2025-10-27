---
title: Storywriting
---

# Storywriting & Creative Writing

**Narrative-tuned models** optimized for immersive storytelling, rich character arcs, evocative prose, and genre-aware stylistic control. These models excel at crafting original fiction, expanding existing worlds, generating dialogue with emotional nuance, and maintaining long-range plot coherence—even across tens of thousands of tokens.

Use the selector below to find the best **creative-writing-optimized** model for your hardware:


<script setup>
import ModelSelector from '../../../components/ModelSelector.vue'
const models = [
  { ramMin: 128, vramMin: 32, models: [{"GPT OSS 120B": { parameters: 120, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q8_K_XL' }}], usefulness: 1.0},
  { ramMin: 128, vramMin: 16, models: [{"GPT OSS 120B": { parameters: 120, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q4_K_XL' }}], usefulness: 0.9},
  { ramMin: 128, vramMin: 12, models: [{"GPT OSS 120B": { parameters: 120, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q6_K_XL' }}], usefulness: 0.8},
  { ramMin: 128, vramMin: 0, models: [{"GPT OSS 120B": { parameters: 120, quantization: 'MXFP4' }}], usefulness: 0.7},

  { ramMin: 64, vramMin: 32, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q8_K_XL' }}], usefulness: 0.8},
  { ramMin: 64, vramMin: 24, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q6_K_XL' }}], usefulness: 0.7},
  { ramMin: 64, vramMin: 12, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q6_K_XL' }}], usefulness: 0.6},
  { ramMin: 64, vramMin: 0, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}], usefulness: 0.5},

  { ramMin: 32, vramMin: 32, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q8_K_XL' }}], usefulness: 0.7},
  { ramMin: 32, vramMin: 24, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q6_K_XL' }}], usefulness: 0.6},
  { ramMin: 32, vramMin: 16, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q8_K_XL' }}], usefulness: 0.5},
  { ramMin: 32, vramMin: 12, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q6_K_XL' }}], usefulness: 0.4},
  { ramMin: 32, vramMin: 8, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q4_K_XL' }}], usefulness: 0.3},
  { ramMin: 32, vramMin: 6, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}], usefulness: 0.25},

  { ramMin: 16, vramMin: 32, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q8_K_XL' }}], usefulness: 0.5},
  { ramMin: 16, vramMin: 24, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q6_K_XL' }}], usefulness: 0.4},
  { ramMin: 16, vramMin: 16, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q8_K_XL' }}], usefulness: 0.3},
  { ramMin: 16, vramMin: 12, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q6_K_XL' }}], usefulness: 0.25},
  { ramMin: 16, vramMin: 8, models: [{"Gemma 3 12B": { parameters: 12, quantization: 'Q4_K_XL' }}], usefulness: 0.2},
]

</script>

<ModelSelector :modelDefinitions="models" />


