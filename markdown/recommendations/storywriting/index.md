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

const ramOptions = [16, 32, 64, 128]
const vramOptions = [0, 4, 6, 8, 12, 16, 24, 32]

// Creative writing model recommendations (based on provided CSV + narrative tuning)
const matrix = [
  ["none", "none", "none", "gemma3 12b creative q4", "gpt-oss 20b story q6", "gpt-oss 20b story q8", "gemma3 27b creative q6", "gemma3 27b creative q8"],
  ["none", "none", "gpt-oss 20b story q4", "gpt-oss 20b story q6", "gpt-oss 20b story q8", "gemma3 27b creative q6", "gemma3 27b creative q8", "gemma3 27b creative bf16"],
  ["gpt-oss 20b story q6", "gpt-oss 20b story q4", "gpt-oss 20b story q6", "gpt-oss 20b story q8", "gemma3 27b creative q6", "gemma3 27b creative q8", "gemma3 27b creative bf16", "gemma3 27b creative bf16"],
  ["gpt-oss 20b story q8", "gpt-oss 20b story q8", "gemma3 27b creative q6", "gemma3 27b creative q8", "gemma3 27b creative bf16", "gemma3 27b creative bf16", "gemma3 27b creative bf16", "gemma3 27b creative bf16"]
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
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336; /* red accent for creative domain */
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
    <strong>Recommended creative-writing model:</strong>
    <span
      class="model-name"
      :class="isRecommended ? 'recommended' : 'not-recommended'"
    >
      {{ recommendedModel }}
    </span>
  </div>
</div>

> ⚠️ **“Not recommended” means unreliable narrative output**  
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