---
title: Personal Assistant
---

# Personal Assistant Use Case

Recommendations for models that excel at memory, context retention, and personalized interactions.

> 💡 **Note**: For personal assistant tasks—such as recalling preferences, maintaining conversation history, managing schedules, or adapting tone over time—**instruct-tuned models with strong long-context handling** are preferred over thinking-tuned variants. These models prioritize coherence, empathy, and user-specific adaptation over raw analytical power.

Use the selector below to find the best **assistant-like** model for your hardware:



<script setup>
import ModelSelector from '../../../components/ModelSelector.vue'
const models = [
  { ramMin: 128, vramMin: 32, models: [{"GPT OSS 120B": { parameters: 120, quantization: 'MXFP4' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}, {"Mistral Small 3.2": { parameters: 24, quantization: 'Q8_K_XL' }}], usefulness: 1.0},
  { ramMin: 128, vramMin: 24, models: [{"GPT OSS 120B": { parameters: 120, quantization: 'MXFP4' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}, {"Mistral Small 3.2": { parameters: 24, quantization: 'Q6_K_XL' }}], usefulness: 0.9},
  { ramMin: 128, vramMin: 0, models: [{"GPT OSS 120B": { parameters: 120, quantization: 'MXFP4' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 0.8},

  { ramMin: 64, vramMin: 24, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 0.8},
  { ramMin: 64, vramMin: 0, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.6},

  { ramMin: 32, vramMin: 24, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q4_K_XL' }}], usefulness: 0.7},
  { ramMin: 32, vramMin: 8, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q6_K_XL' }}], usefulness: 0.5},
  { ramMin: 32, vramMin: 0, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}], usefulness: 0.4},

  { ramMin: 16, vramMin: 32, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q8_K_XL' }}], usefulness: 0.6},
  { ramMin: 16, vramMin: 24, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q4_K_XL' }}], usefulness: 0.5},
  { ramMin: 16, vramMin: 12, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}], usefulness: 0.4},
  { ramMin: 16, vramMin: 8, models: [{"Gemma 3 12B": { parameters: 12, quantization: 'Q4_K_XL' }}], usefulness: 0.3},
  { ramMin: 16, vramMin: 4, models: [{"Qwen3 4B Instruct 2507": { parameters: 4, quantization: 'Q4_K_XL' }}], usefulness: 0.2},
]

</script>

<ModelSelector :modelDefinitions="models" />

