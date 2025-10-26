---
title: Instruct Models
---

# Instruct-Tuned Models

Instruct-tuned models are AI assistants trained specifically to understand and follow your directions—whether you're asking for help writing an email, summarizing a document, planning a trip, or explaining a complex idea. Unlike raw base models, these are fine-tuned to respond helpfully, clearly, and on-topic.

Use the selector below to find the best **instruct-tuned** model that matches your computer’s capabilities:

<script setup>
import ModelSelector from '../../../components/ModelSelector.vue'

const models = [
  { ramMin: 128, vramMin: 32, models: [{"Mistral Small": { parameters: 24, quantization: 'Q8_0' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 1.0},
  { ramMin: 128, vramMin: 24, models: [{"Mistral Small": { parameters: 24, quantization: 'Q6_K_M' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 0.9},
  { ramMin: 128, vramMin: 0, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 0.8},

  { ramMin: 64, vramMin: 32, models: [{"Mistral Small": { parameters: 24, quantization: 'Q8_0' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 0.9},
  { ramMin: 64, vramMin: 24, models: [{"Mistral Small": { parameters: 24, quantization: 'Q6_K_M' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_0' }}], usefulness: 0.8},
  { ramMin: 64, vramMin: 16, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_0' }}], usefulness: 0.7},
  { ramMin: 64, vramMin: 12, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_0' }}], usefulness: 0.6},
  { ramMin: 64, vramMin: 8, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_0' }}], usefulness: 0.5},
  { ramMin: 64, vramMin: 6, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_0' }}], usefulness: 0.4},
  { ramMin: 64, vramMin: 4, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_0' }}], usefulness: 0.3},
  { ramMin: 64, vramMin: 0, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_0' }}], usefulness: 0.2},

  { ramMin: 32, vramMin: 32, models: [{"Mistral Small": { parameters: 24, quantization: 'Q8_0' }}], usefulness: 0.8},
  { ramMin: 32, vramMin: 24, models: [{"Mistral Small": { parameters: 24, quantization: 'Q6_K_M' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_0' }}], usefulness: 0.7},
  { ramMin: 32, vramMin: 16, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_0' }}], usefulness: 0.6},
  { ramMin: 32, vramMin: 8, models: [{"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q6_K_M' }}], usefulness: 0.4},
  { ramMin: 32, vramMin: 4, models: [{"Qwen3 4B Instruct 2507": { parameters: 4, quantization: 'BF16' }}], usefulness: 0.3},

  { ramMin: 16, vramMin: 32, models: [{"Mistral Small": { parameters: 24, quantization: 'Q8_0' }}], usefulness: 0.6},
  { ramMin: 16, vramMin: 24, models: [{"Mistral Small": { parameters: 24, quantization: 'Q6_K_M' }}], usefulness: 0.5},
  { ramMin: 16, vramMin: 12, models: [{"Qwen3 4B Instruct 2507": { parameters: 4, quantization: 'BF16' }}], usefulness: 0.3},
  { ramMin: 16, vramMin: 4, models: [{"Qwen3 4B Instruct 2507": { parameters: 4, quantization: 'Q4_K_XL' }}], usefulness: 0.2},
]

</script>

<ModelSelector :modelDefinitions="models" />

## How to Use Instruct Models Effectively

These models shine when given clear, thoughtful instructions. Follow these tips to get the most helpful, accurate, and reliable responses—whether you're drafting messages, researching topics, or organizing your day.

### 1. **Always Choose an “Instruct” Model**
- Look for **`instruct`** in the model name (e.g., `qwen3 30b instruct`, `mistral small`). These are specially trained to follow directions.
- Non-instruct models may ignore your request or give generic, off-topic replies.

### 2. **Pick the Right Version for Your Hardware**
| Version | Best For | Notes |
|--------|--------|------|
| `bf16` / `f16` | Best quality, powerful GPUs | Highest accuracy; needs lots of VRAM |
| `q6` / `q8` | Great balance of speed and clarity | Works well on most modern laptops or desktops |
| `q4` | Limited VRAM (e.g., older or entry-level GPUs) | Faster but may miss finer details or nuance |

### 3. **Use Your GPU Fully (If Available)**
- In apps like **LM Studio**, enable full GPU offloading to keep things fast and smooth.
- Example: For `qwen3 30b instruct`, try loading **all layers** onto the GPU if you have enough VRAM.
- Partial use of the GPU can cause slowdowns as the system swaps data between memory and graphics card.

### 4. **Mind the Context Length**
- All recommended models support **16,000+ tokens** of context—enough for long emails, reports, or multi-turn conversations.
- Very long inputs use more memory; if your system feels sluggish, shorten your prompt or reduce the model’s quantization.

### 5. **Be Clear and Specific in Your Requests**
- ❌ _“Tell me about climate change.”_  
- ✅ _“Explain the main causes of climate change in simple terms, as if I’m 15 years old.”_
- The more precise your instruction—goal, audience, format, or examples—the better the response.

### 6. **Avoid “Not Recommended” Setups**
- If the tool says **“Not recommended,”** your device likely can’t run even the smallest instruct model well.
- Trying to force it may result in **slow replies, crashes, or unreliable answers**.
- In that case, consider using a cloud-based service (like OpenRouter or Together.ai) or upgrading your hardware.

### 7. **Watch Your System Resources**
- **Windows**: Open Task Manager → Performance → GPU  
- **Linux**: Use `nvidia-smi` (NVIDIA) or `radeontop` (AMD)
- If VRAM usage goes above **90%**, try a lighter model version (e.g., switch from `q8` to `q6`) or shorten your input.

By matching the right model to your hardware and giving clear, purposeful instructions, you’ll enjoy a smooth, intelligent assistant experience—perfect for everyday tasks, learning, planning, and more.