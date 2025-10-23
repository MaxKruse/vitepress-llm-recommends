---
title: Storywriting
---

# Storywriting & Creative Writing

**Narrative-tuned models** optimized for immersive storytelling, rich character arcs, evocative prose, and genre-aware stylistic control. These models excel at crafting original fiction, expanding existing worlds, generating dialogue with emotional nuance, and maintaining long-range plot coherence—even across tens of thousands of tokens.

Use the selector below to find the best **creative-writing-optimized** model for your hardware:


<script setup>
import { ref, computed } from 'vue'

const ram = ref(16)
const vram = ref(8)

// Define the available options
const ramOptions = [16, 32, 64, 128]
const vramOptions = [0, 4, 6, 8, 12, 16, 24, 32]

const recommendationRules = [
  // Very high RAM (128 GB)
  { ramMin: 128, vramMin: 32, model: "GPT OSS 120B or Gemma 3 27B Q8", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 24, model: "GPT OSS 120B or Gemma 3 27B Q6", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 16, model: "GPT OSS 120B or Gemma 3 12B Q8", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 12, model: "GPT OSS 120B or Gemma 3 12B Q6", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 8, model: "GPT OSS 120B", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 6, model: "GPT OSS 120B", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 4, model: "GPT OSS 120B", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 0, model: "GPT OSS 120B", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },

  // High RAM (64 GB)
  { ramMin: 64, vramMin: 32, model: "GPT OSS 20B or Gemma 3 27B Q8", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 24, model: "GPT OSS 20B or Gemma 3 27B Q6", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 16, model: "GPT OSS 20B or Gemma 3 12B Q8", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 12, model: "GPT OSS 20B or Gemma 3 12B Q6", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 8, model: "GPT OSS 20B", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 6, model: "GPT OSS 20B", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 4, model: "GPT OSS 20B", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 0, model: "GPT OSS 20B", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },

  // Medium RAM (32 GB)
  { ramMin: 32, vramMin: 32, model: "GPT OSS 20B or Gemma 3 27B Q8", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 24, model: "GPT OSS 20B or Gemma 3 27B Q6", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 16, model: "GPT OSS 20B or Gemma 3 12B Q8", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 12, model: "GPT OSS 20B or Gemma 3 12B Q6", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 8, model: "GPT OSS 20B or Gemma 3 12B Q4", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 6, model: "GPT OSS 20B", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  // vramMin: 4 and 0 → "none" → omitted

  // Low RAM (16 GB)
  { ramMin: 16, vramMin: 32, model: "GPT OSS 20B or Gemma 3 27B Q8", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 24, model: "GPT OSS 20B or Gemma 3 27B Q6", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 16, model: "GPT OSS 20B or Gemma 3 12B Q8", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 12, model: "GPT OSS 20B or Gemma 3 12B Q6", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 8, model: "Gemma 3 12B Q4", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  // vramMin: 6, 4, 0 → "none" → omitted
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

> **“Not recommended” means unreliable narrative output**
> If the selector returns “Not recommended,” your system likely lacks the resources to run even the smallest narrative-tuned model effectively. In such cases, stories may suffer from **incoherent plot shifts**, **flat characters**, or **repetitive phrasing**—often worse than drafting manually.

---

## How to Use Narrative-Tuned Models for Storywriting

These models are designed for **long-form creative expression**, not factual QA or code generation. Follow these guidelines to maximize emotional depth, stylistic control, and narrative consistency.

### 1. **Quantization & Style Trade-offs**
| Quant | Use Case | Creative Impact |
|------|--------|----------------|
| `bf16` / `f16` | Literary nuance, poetic rhythm, complex metaphors | Best for lyrical prose, experimental fiction, or deep POV |
| `q8` | Balanced fluency | Ideal for most genres (fantasy, sci-fi, romance) with strong pacing |
| `q6` / `q4` | Low-resource systems | May flatten emotional arcs or repeat phrases—use only when necessary |

> 📝 **Tip**: For dialogue-heavy scenes, `q8` or higher preserves vocal distinctiveness better than `q4`.

### 2. **Full GPU Offload Is Essential for Long Context**
- **Narrative context lives in VRAM**—always enable **full GPU offload** (e.g., 48/48 layers).
- This ensures the model can reference earlier plot points, character traits, or worldbuilding details without slowing down.

### 3. **Prompt with Worldbuilding & Voice Cues**
Creative models respond best to **rich, sensory prompts**:
- ❌ _“Write a fantasy story.”_  
- ✅ _“Write a 500-word scene where a disillusioned clockwork mage in a steampunk city discovers her automaton companion has developed emotions. Use close third-person POV, melancholic tone, and include tactile details (oil, brass, rain).”_
- Include:
  - Genre & subgenre (e.g., “cozy fantasy,” “cyberpunk noir”)
  - Character backstory or emotional state
  - Desired pacing (e.g., “slow-burn tension,” “rapid action sequence”)
  - Stylistic references (e.g., “like Neil Gaiman meets Becky Chambers”)

  > **For additional resources, check out [SillyTavernAI](https://sillytavernai.com/) and their community.

### 4. **Avoid “None” Configurations**
- If your hardware yields **“none”**, do **not** force a model load via heavy CPU offloading.
- You'll get **incoherent timelines**, **OOC (out-of-character) dialogue**, or **generic tropes**—worse than writing unassisted.
- Alternatives:
  - Use cloud inference (e.g., [aistudio.google.com](https://aistudio.google.com/prompts/new_chat?model=gemma-3-27b-it) )
  - Upgrade to ≥8 GB VRAM for basic story continuity

### 7. **Monitor Context Window Usage**
- Creative writing benefits from **long context** (16K+ tokens) to maintain continuity.
- If VRAM usage exceeds 90%, consider:
  - Reducing context length (but risk losing plot threads)
  - Switching to a lower quant (e.g., `bf16` → `q8`)
  - Using **chunked generation** (write scene-by-scene with memory prompts)

---

By aligning your hardware, model choice, and prompt design with these principles, you'll unlock **emotionally resonant, stylistically rich storytelling**—whether you're drafting a novel, exploring alternate universes, or breathing life into original characters.