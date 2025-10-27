---
title: STEM
---

# STEM (Science, Technology, Engineering, Mathematics)

**Thinking-tuned models** optimized for technical reasoning, mathematical precision, scientific problem-solving, and code-heavy workflows. These models excel at tasks like deriving equations, debugging complex systems, simulating experiments, and explaining STEM concepts with rigor.

> 💡 **Note**: All models listed below are *thinking-tuned variants* (e.g., `qwen3 4b thinking`), which are specifically fine-tuned for analytical depth—not general-purpose chat. They outperform standard instruct models on logic-heavy, multi-step STEM problems.

Use the selector below to find the best **thinking-tuned** model for your hardware:


<script setup>
import ModelSelector from '../../../components/ModelSelector.vue'
const models = [
  { ramMin: 128, vramMin: 0, models: [{"Qwen3 30B Thinking 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 1.0},

  { ramMin: 64, vramMin: 32, models: [{"Qwen3 30B Thinking 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 0.8},
  { ramMin: 64, vramMin: 12, models: [{"Qwen3 30B Thinking 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.6},
  { ramMin: 64, vramMin: 0, models: [{"Qwen3 30B Thinking 2507": { parameters: 30, quantization: 'Q6_K_XL' }}], usefulness: 0.5},

  { ramMin: 32, vramMin: 32, models: [{"Qwen3 30B Thinking 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.7},
  { ramMin: 32, vramMin: 24, models: [{"Qwen3 30B Thinking 2507": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.6},
  { ramMin: 32, vramMin: 12, models: [{"Qwen3 4B Thinking 2507": { parameters: 4, quantization: 'BF16' }}], usefulness: 0.5},
  { ramMin: 32, vramMin: 8, models: [{"Qwen3 4B Thinking 2507": { parameters: 4, quantization: 'Q8_K_XL' }}], usefulness: 0.4},
  { ramMin: 32, vramMin: 0, models: [{"Qwen3 4B Thinking 2507": { parameters: 4, quantization: 'Q6_K_XL' }}], usefulness: 0.3},

  { ramMin: 16, vramMin: 32, models: [{"Qwen3 4B Thinking 2507": { parameters: 4, quantization: 'BF16' }}, {"Qwen3 30B Thinking 2507": { parameters: 30, quantization: 'Q6_K_XL' }}], usefulness: 0.5},
  { ramMin: 16, vramMin: 12, models: [{"Qwen3 4B Thinking 2507": { parameters: 4, quantization: 'BF16' }}], usefulness: 0.4},
  { ramMin: 16, vramMin: 8, models: [{"Qwen3 4B Thinking 2507": { parameters: 4, quantization: 'Q8_K_XL' }}], usefulness: 0.3},
  { ramMin: 16, vramMin: 6, models: [{"Qwen3 4B Thinking 2507": { parameters: 4, quantization: 'Q6_K_XL' }}], usefulness: 0.25},
  { ramMin: 16, vramMin: 4, models: [{"Qwen3 4B Thinking 2507": { parameters: 4, quantization: 'Q4_K_XL' }}], usefulness: 0.2},
]

</script>

<ModelSelector :modelDefinitions="models" />

