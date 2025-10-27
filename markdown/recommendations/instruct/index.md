---
title: Instruct Models
---

# Instruct-Tuned Models

Instruct-tuned models are AI assistants trained specifically to understand and follow your directions—whether you're asking for help writing an email, summarizing a document, planning a trip, or explaining a complex idea. Unlike raw base models, these are fine-tuned to respond helpfully, clearly, and on-topic.

Use the selector below to find the best **instruct-tuned** model that matches your computer’s capabilities:

<script setup>
import ModelSelector from '../../../components/ModelSelector.vue'

const models = [
  { ramMin: 128, vramMin: 32, models: [{"Mistral Small 3.2": { parameters: 24, quantization: 'Q8_K_XL' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 1.0},
  { ramMin: 128, vramMin: 24, models: [{"Mistral Small 3.2": { parameters: 24, quantization: 'Q6_K_XL' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 0.9},
  { ramMin: 128, vramMin: 0, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 0.8},

  { ramMin: 64, vramMin: 32, models: [{"Mistral Small 3.2": { parameters: 24, quantization: 'Q8_K_XL' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 0.9},
  { ramMin: 64, vramMin: 24, models: [{"Mistral Small 3.2": { parameters: 24, quantization: 'Q6_K_XL' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.8},
  { ramMin: 64, vramMin: 16, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.7},
  { ramMin: 64, vramMin: 12, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.6},
  { ramMin: 64, vramMin: 8, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.5},
  { ramMin: 64, vramMin: 6, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.4},
  { ramMin: 64, vramMin: 4, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.3},
  { ramMin: 64, vramMin: 0, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.2},

  { ramMin: 32, vramMin: 32, models: [{"Mistral Small 3.2": { parameters: 24, quantization: 'Q8_K_XL' }}], usefulness: 0.8},
  { ramMin: 32, vramMin: 24, models: [{"Mistral Small 3.2": { parameters: 24, quantization: 'Q6_K_XL' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.7},
  { ramMin: 32, vramMin: 16, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.6},
  { ramMin: 32, vramMin: 8, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q6_K_XL' }}], usefulness: 0.4},
  { ramMin: 32, vramMin: 4, models: [{"Qwen3 4B Instruct 2507": { parameters: 4, quantization: 'BF16' }}], usefulness: 0.3},

  { ramMin: 16, vramMin: 32, models: [{"Mistral Small 3.2": { parameters: 24, quantization: 'Q8_K_XL' }}], usefulness: 0.6},
  { ramMin: 16, vramMin: 24, models: [{"Mistral Small 3.2": { parameters: 24, quantization: 'Q6_K_XL' }}], usefulness: 0.5},
  { ramMin: 16, vramMin: 12, models: [{"Qwen3 4B Instruct 2507": { parameters: 4, quantization: 'BF16' }}], usefulness: 0.3},
  { ramMin: 16, vramMin: 4, models: [{"Qwen3 4B Instruct 2507": { parameters: 4, quantization: 'Q4_K_XL' }}], usefulness: 0.2},
]

</script>

<ModelSelector :modelDefinitions="models" />

