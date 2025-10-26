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

// Define the available options
const ramOptions = [16, 32, 64, 128]
const vramOptions = [0, 4, 6, 8, 12, 16, 24, 32]

// Define your recommendation rules here - much easier to maintain!
const recommendationRules = [
  
  { ramMin: 128, vramMin: 32, model: "Mistral Small Q8 or Qwen3 30B Instruct 2507 BF16", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  
  { ramMin: 128, vramMin: 24, model: "Mistral Small Q6 or Qwen3 30B Instruct 2507 BF16", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 0, model: "Qwen3 30B Instruct 2507 BF16", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },


  { ramMin: 64, vramMin: 32, model: "Mistral Small Q8 or Qwen3 30B Instruct 2507 BF16", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  
  { ramMin: 64, vramMin: 24, model: "Mistral Small Q6 or Qwen3 30B Instruct 2507 Q8", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  
  
  { ramMin: 64, vramMin: 16, model: "Qwen3 30B Instruct 2507 Q8", color: "var(--vp-c-yellow-2)", bg: "var(--vp-c-yellow-soft)" },
  { ramMin: 64, vramMin: 12, model: "Qwen3 30B Instruct 2507 Q8", color: "var(--vp-c-yellow-2)", bg: "var(--vp-c-yellow-soft)" },
  { ramMin: 64, vramMin: 8, model: "Qwen3 30B Instruct 2507 Q8", color: "var(--vp-c-yellow-2)", bg: "var(--vp-c-yellow-soft)" },
  
  { ramMin: 64, vramMin: 6, model: "Qwen3 30B Instruct 2507 Q8", color: "var(--vp-c-yellow-2)", bg: "var(--vp-c-yellow-soft)" },
  { ramMin: 64, vramMin: 4, model: "Qwen3 30B Instruct 2507 Q8", color: "var(--vp-c-yellow-2)", bg: "var(--vp-c-yellow-soft)" },
  { ramMin: 64, vramMin: 0, model: "Qwen3 30B Instruct 2507 Q8", color: "var(--vp-c-yellow-2)", bg: "var(--vp-c-yellow-soft)" },


  { ramMin: 32, vramMin: 32, model: "Mistral Small Q8", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  
  { ramMin: 32, vramMin: 24, model: "Mistral Small Q6 or Qwen3 30B Instruct 2507 Q8", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },


  { ramMin: 32, vramMin: 16, model: "Qwen3 30B Instruct 2507 Q8", color: "var(--vp-c-yellow-2)", bg: "var(--vp-c-yellow-soft)" },
  { ramMin: 32, vramMin: 8, model: "Qwen3 30B Instruct 2507 Q6", color: "var(--vp-c-yellow-2)", bg: "var(--vp-c-yellow-soft)"  },
  { ramMin: 32, vramMin: 4, model: "Qwen3 4B Instruct 2507 BF16", color: "var(--vp-c-yellow-2)", bg: "var(--vp-c-yellow-soft)" },


  { ramMin: 16, vramMin: 32, model: "Mistral Small Q8", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 24, model: "Mistral Small Q6", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 12, model: "Qwen3 4B Instruct 2507 BF16", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 4, model: "Qwen3 4B Instruct 2507 Q4", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  
]

const recommendedModel = computed(() => {
  // Find the first rule that matches the current RAM and VRAM
  const matchingRule = recommendationRules.find(rule => ram.value >= rule.ramMin && vram.value >= rule.vramMin)
  
  if (matchingRule) {
    return {
      model: matchingRule.model,
      color: matchingRule.color,
      bg: matchingRule.bg
    }
  }
  
  return {
    model: 'Not recommended',
    color: 'var(--vp-c-text-3)',
    bg: 'transparent'
  }
})

const isRecommended = computed(() => {
  return recommendedModel.value.model !== 'Not recommended'
})

/* Normalized detection + canonical classes */
const normalizedModel = computed(() => recommendedModel.value.model.toLowerCase())

const isBF16orGPTOSS = computed(() =>
  normalizedModel.value.includes('bf16') || normalizedModel.value.includes('gpt oss')
)

const isQ6orQ8 = computed(() =>
  normalizedModel.value.includes('q6') || normalizedModel.value.includes('q8')
)

const isQ4 = computed(() => normalizedModel.value.includes('q4'))

const is4b = computed(() => normalizedModel.value.includes('4b'))

const selectorClass = computed(() => {
  if (!isRecommended.value) return { 'not-recommended': true }
  if (is4b.value) return { 'recommended-4b': true }
  if (isBF16orGPTOSS.value) return { 'recommended-success': true }
  if (isQ6orQ8.value) return { 'recommended-caution': true }
  if (isQ4.value) return { 'recommended-warning': true }
  return {}
})

const modelNameClasses = computed(() => {
  if (!isRecommended.value) return { 'not-recommended': true }
  if (is4b.value) return { 'recommended-4b': true }
  if (isBF16orGPTOSS.value) return { 'recommended-success': true }
  if (isQ6orQ8.value) return { 'recommended-caution': true }
  if (isQ4.value) return { 'recommended-warning': true }
  return {}
})
</script>

<style scoped>
.model-selector {
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 16px;
  background-color: var(--vp-code-block-bg);
  border: 2px solid var(--vp-c-border); /* Default border */
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
  position: relative;
  overflow: hidden; /* Ensures background colors stay within bounds */
}

.model-selector::before {
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
.model-selector.recommended-success {
  border-color: var(--vp-c-green-2);
}
.model-selector.recommended-caution {
  border-color: var(--vp-c-yellow-2);
}
.model-selector.recommended-warning {
  border-color: var(--vp-c-orange-2);
}
.model-selector.recommended-4b {
  border-color: var(--vp-c-purple-2);
}

.model-selector h3 {
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

.control-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.control-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
}

.control-group select {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.control-group select:hover {
  border-color: var(--vp-c-brand-lighter);
}

.control-group select:focus {
  outline: none;
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.25);
}

.result {
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.result strong {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.result .model-name {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.95em;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid transparent; /* Default border */
}

.result .model-name.not-recommended {
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-text-3);
  font-style: italic;
}

/* Dynamically applied styles based on recommendation level */
.result .model-name.recommended-success {
  background-color: var(--vp-c-green-soft);
  color: var(--vp-c-green-2);
  border-color: var(--vp-c-green-2);
}
 
.result .model-name.recommended-caution {
  background-color: var(--vp-c-yellow-soft);
  color: var(--vp-c-yellow-2);
  border-color: var(--vp-c-yellow-2);
}
 
.result .model-name.recommended-warning {
  background-color: var(--vp-c-orange-soft);
  color: var(--vp-c-orange-2);
  border-color: var(--vp-c-orange-2);
}
 
.result .model-name.recommended-4b {
  background-color: var(--vp-c-purple-soft);
  color: var(--vp-c-purple-2);
  border-color: var(--vp-c-purple-2);
}
 
</style>

<div class="model-selector" :class="selectorClass">
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
    <strong>Recommended model:</strong>
    <span
      class="model-name"
      :class="modelNameClasses"
      :style="{ backgroundColor: recommendedModel.bg, color: recommendedModel.color }"
    >
      {{ recommendedModel.model }}
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