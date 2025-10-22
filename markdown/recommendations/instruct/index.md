---
title: Instruct Models
---

# Instruct-Tuned Models

Instruct-tuned models are AI assistants trained specifically to understand and follow your directions—whether you're asking for help writing an email, summarizing a document, planning a trip, or explaining a complex idea. Unlike raw base models, these are fine-tuned to respond helpfully, clearly, and on-topic.

Use the selector below to find the best **instruct-tuned** model that matches your computer’s capabilities:

<script setup>
import { ref, computed } from 'vue'

const ram = ref(16)
const vram = ref(8)

const ramOptions = [16, 32, 64, 128]
const vramOptions = [0, 4, 6, 8, 12, 16, 24, 32]

const matrix = [
  ["none", "qwen3 4b instruct 2507 q4", "qwen3 4b instruct 2507 q4", "qwen3 4b instruct 2507 q8", "qwen3 4b instruct 2507 bf16", "qwen3 4b instruct 2507 bf16", "mistral small q4", "mistral small q8"],
  ["none", "qwen3 4b instruct 2507 q4", "qwen3 4b instruct 2507 q4", "qwen3 4b instruct 2507 q8", "qwen3 4b instruct 2507 bf16", "qwen3 4b instruct 2507 bf16", "mistral small q4 or qwen3 30b instruct q6", "mistral small q8"],
  ["qwen3 30b instruct q6", "qwen3 30b instruct q6", "qwen3 30b instruct q6", "qwen3 30b instruct q8", "qwen3 30b instruct q8", "qwen3 30b instruct q8", "mistral small q4 or qwen3 30b instruct q8", "mistral small q8 or qwen3 30b instruct bf16"],
  ["qwen3 30b instruct q8", "qwen3 30b instruct q8", "qwen3 30b instruct q8", "qwen3 30b instruct bf16", "qwen3 30b instruct bf16", "qwen3 30b instruct bf16", "mistral small q4 or qwen3 30b instruct q8", "mistral small q8 or qwen3 30b instruct bf16"]
]

const recommendedModel = computed(() => {
  const ri = ramOptions.indexOf(ram.value)
  const vi = vramOptions.indexOf(vram.value)
  if (ri === -1 || vi === -1) return 'Invalid selection'
  const model = matrix[ri][vi]
  return model === 'none' ? 'Not recommended' : model
})

const isRecommended = computed(() => {
  return recommendedModel.value !== 'Not recommended'
})
</script>

<style scoped>
.model-selector {
  margin: 2rem 0;
  padding: 1.25rem;
  border-radius: 12px;
  background-color: var(--vp-code-block-bg);
  border: 1px solid var(--vp-c-divider);
  font-size: 0.95rem;
}

.model-selector h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-weight: 600;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  min-width: 140px;
}

.control-group label {
  font-weight: 500;
  margin-bottom: 0.375rem;
  color: var(--vp-c-text-1);
}

.control-group select {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.control-group select:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
}

.result {
  padding-top: 0.5rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 1rem;
}

.result strong {
  display: block;
  margin-bottom: 0.375rem;
  color: var(--vp-c-text-1);
}

.result .model-name {
  padding: 0.375rem 0.625rem;
  border-radius: 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.925em;
}

.result .not-recommended {
  color: var(--vp-c-text-3);
  background: transparent;
  font-style: italic;
}

.result .recommended {
  background-color: rgba(66, 133, 244, 0.1);
  color: var(--vp-c-brand);
}
</style>

<div class="model-selector">
  <div class="controls">
    <div class="control-group">
      <label for="ram-select">RAM (GB)</label>
      <select id="ram-select" v-model.number="ram">
        <option v-for="r in ramOptions" :key="r" :value="r">{{ r }}</option>
      </select>
    </div>
    <div class="control-group">
      <label for="vram-select">VRAM (GB)</label>
      <select id="vram-select" v-model.number="vram">
        <option v-for="v in vramOptions" :key="v" :value="v">{{ v }}</option>
      </select>
    </div>
  </div>

  <div class="result">
    <strong>Recommended instruct model:</strong>
    <span
      class="model-name"
      :class="isRecommended ? 'recommended' : 'not-recommended'"
    >
      {{ recommendedModel }}
    </span>
  </div>
</div>

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