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

const ramOptions = [16, 32, 64, 128]
const vramOptions = [0, 4, 6, 8, 12, 16, 24, 32]

// Based on your provided CSV + known personal assistant suitability
// Prioritizing models with strong instruction-following, memory simulation, and chat fluency
const matrix = [
  ["none", "none", "qwen3 4b instruct q4", "gemma3 12b instruct q4", "gpt-oss 20b ", "gpt-oss 20b instruct q6", "gpt-oss 20b instruct q6 or gemma3 27b q4", "gemma3 27b q8"],
  ["gpt-oss 20b ", "gpt-oss 20b ", "gpt-oss 20b ", "gpt-oss 20b instruct q6", "gpt-oss 20b instruct q6", "gpt-oss 20b instruct q6", "gemma3 27b q4", "gemma3 27b q8"],
  ["qwen3 30b instruct q6", "qwen3 30b instruct q6", "qwen3 30b instruct q6", "qwen3 30b instruct q6", "qwen3 30b instruct q8", "qwen3 30b instruct q8", "qwen3 30b instruct q8", "qwen3 30b instruct bf16"],
  ["qwen3 30b instruct bf16", "qwen3 30b instruct bf16", "qwen3 30b instruct bf16", "qwen3 30b instruct bf16", "qwen3 30b instruct bf16", "qwen3 30b instruct bf16", "qwen3 30b instruct bf16", "qwen3 30b instruct bf16"]
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
    <strong>Recommended instruct-tuned model for Personal Assistant:</strong>
    <span
      class="model-name"
      :class="isRecommended ? 'recommended' : 'not-recommended'"
    >
      {{ recommendedModel }}
    </span>
  </div>
</div>

> ⚠️ **“Not recommended” means poor conversational memory and unreliable personalization**  
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