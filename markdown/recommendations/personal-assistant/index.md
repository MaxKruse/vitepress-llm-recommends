---
title: Personal Assistant
---

# Personal Assistant Use Case

Recommendations for models that excel at memory, context retention, and personalized interactions.

> 💡 **Note**: For personal assistant tasks—such as recalling preferences, maintaining conversation history, managing schedules, or adapting tone over time—**instruct-tuned models with strong long-context handling** are preferred over thinking-tuned variants. These models prioritize coherence, empathy, and user-specific adaptation over raw analytical power.

Use the selector below to find the best **assistant-like** model for your hardware:


<script setup>
import { ref, computed } from 'vue'

const ram = ref(16)
const vram = ref(8)

// Define the available options
const ramOptions = [16, 32, 64, 128]
const vramOptions = [0, 4, 6, 8, 12, 16, 24, 32]

// Define your recommendation rules here - much easier to maintain!
const recommendationRules = [
  // Very high RAM (128 GB) - BF16 or high quant
  { ramMin: 128, vramMin: 32, model: "GPT OSS 120B or Qwen3 30B Instruct BF16 or Mistral Small 3.2 Q8", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 24, model: "GPT OSS 120B or Qwen3 30B Instruct BF16 or Mistral Small 3.2 Q6", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 0, model: "GPT OSS 120B or Qwen3 30B Instruct 2507 BF16", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },

  // High RAM (64 GB)
  { ramMin: 64, vramMin: 24, model: "GPT OSS 20B or Qwen3 30B Instruct 2507 BF16", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 0, model: "GPT OSS 20B or Qwen3 30B Instruct 2507 Q8", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },

  // Medium RAM (32 GB)
  { ramMin: 32, vramMin: 24, model: "GPT OSS 20B or Gemma 3 27B Q4", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 8, model: "GPT OSS 20B or Gemma 3 12B Q6", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 0, model: "GPT OSS 20B", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },

  // Low RAM (16 GB)
  { ramMin: 16, vramMin: 32, model: "GPT OSS 20B or Gemma 3 27B Q8", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 24, model: "GPT OSS 20B or Gemma 3 27B Q4", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 12, model: "GPT OSS 20B", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 8, model: "Gemma 3 12B Q4", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 4, model: "Qwen3 4B Q4", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  // vramMin: 0 with 16GB RAM is "none" per CSV → omitted
];

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

> **“Not recommended” means poor conversational memory and unreliable personalization**
> On under-resourced systems, models may forget prior context within a few exchanges or fail to maintain consistent user preferences—making them ineffective as true personal assistants.

---

## How to Use Instruct-Tuned Models as a Personal Assistant

Personal assistant models thrive on **long-term context awareness**, **empathetic tone**, and **user-specific adaptation**. These prioritize natural dialogue, recall simulation, and task coordination.

### 1. **Choose Instruct-Tuned Models**
- Use **`instruct`** variants (e.g., `qwen3 4b instruct`, `gpt-oss 20b`)—they're fine-tuned for:
  - Following multi-turn instructions
  - Remembering stated preferences (“I prefer morning summaries”)
  - Managing to-do lists, reminders, or journaling prompts
  - Adapting tone (casual, professional, supportive)
- Avoid `thinking` models—they may over-analyze simple requests or ignore emotional nuance.

### 2. **Prioritize Context Length & Quantization**
| Quant | Assistant Impact |
|------|------------------|
| `bf16` / `f16` | Best for full personality retention over long chats; ideal if you use 32K+ context |
| `q8` | Excellent balance—retains nuance while fitting in moderate VRAM |
| `q6` / `q4` | Usable for basic tasks, but may “forget” early conversation details in long sessions |

> 🔹 **Tip**: For personal assistants, **context length matters more than raw parameter count**. A well-quantized 20B model with 32K context often outperforms a 30B model limited to 4K.

### 3. **Enable Full GPU Offload**
- Always use **full GPU offload** (e.g., 48/48 layers) in LM Studio to keep conversation fast and responsive.
- If LM Studio pre-selects offload settings for your model, **do not override them**.

### 4. **Simulate Memory with Prompt Engineering**
Since local models lack true persistent memory:
- **Seed your prompt** with key facts:
  ```text
  You are my personal assistant. I'm a developer who enjoys Blender 3D. I eat meals regularly and track my learning goals. Today is Thursday, October 23, 2025.
  ```
- Use **structured recall cues**:
  - “Based on our last conversation about Blender shaders…”
  - “Remind me of my food preferences before suggesting dinner ideas.”

### 5. **Avoid “None” Configurations**
- Systems returning “none” lack the capacity to maintain even short-term conversational state.
- Forcing a load via CPU offload leads to:
  - Slow responses that break conversational flow
- **Minimum viable setup**: ≥6 GB VRAM + `qwen3 4b instruct q4` for basic assistant duties.

### 6. **Combine with External Memory (Advanced)**
For true long-term memory:
- Log key interactions to a local file or database
- Inject summarized memory into each new session:
  ```text
  [Memory Summary: User is learning Blender geometry nodes. Last discussed procedural terrain generation on Oct 20. Prefers vegetarian meal suggestions.]
  ```
- This turns even a 4B model into a surprisingly capable companion.

### 7. **Monitor Resource Usage**
- Keep VRAM usage **below 90%** to avoid swapping, which destroys real-time responsiveness.
- On Windows, disable background apps (Discord, browsers) to free up the extra 1-2 GB needed for smooth 16K context.

---

By selecting the right instruct-tuned model for your hardware and structuring interactions to simulate memory, you can create a **responsive, personalized, and helpful local AI assistant**—without relying on cloud services or sacrificing privacy.