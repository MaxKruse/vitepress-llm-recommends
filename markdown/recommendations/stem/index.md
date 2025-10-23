---
title: STEM
---

# STEM (Science, Technology, Engineering, Mathematics)

**Thinking-tuned models** optimized for technical reasoning, mathematical precision, scientific problem-solving, and code-heavy workflows. These models excel at tasks like deriving equations, debugging complex systems, simulating experiments, and explaining STEM concepts with rigor.

> 💡 **Note**: All models listed below are *thinking-tuned variants* (e.g., `qwen3 4b thinking`), which are specifically fine-tuned for analytical depth—not general-purpose chat. They outperform standard instruct models on logic-heavy, multi-step STEM problems.

Use the selector below to find the best **thinking-tuned** model for your hardware:


<script setup>
import { ref, computed } from 'vue'

const ram = ref(16)
const vram = ref(8)

// Define the available options
const ramOptions = [16, 32, 64, 128]
const vramOptions = [0, 4, 6, 8, 12, 16, 24, 32]

const recommendationRules = [
  // Very high RAM (128 GB)
  { ramMin: 128, vramMin: 32, model: "Qwen3-30B-Thinking BF16", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 24, model: "Qwen3-30B-Thinking BF16", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 16, model: "Qwen3-30B-Thinking BF16", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 12, model: "Qwen3-30B-Thinking BF16", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 8, model: "Qwen3-30B-Thinking BF16", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 6, model: "Qwen3-30B-Thinking BF16", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 4, model: "Qwen3-30B-Thinking BF16", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },
  { ramMin: 128, vramMin: 0, model: "Qwen3-30B-Thinking BF16", color: "var(--vp-c-green-2)", bg: "var(--vp-c-green-soft)" },

  // High RAM (64 GB)
  { ramMin: 64, vramMin: 32, model: "Qwen3-30B-Thinking BF16", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 24, model: "Qwen3-30B-Thinking Q8", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 16, model: "Qwen3-30B-Thinking Q8", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 12, model: "Qwen3-30B-Thinking Q8", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 8, model: "Qwen3-30B-Thinking Q6", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 6, model: "Qwen3-30B-Thinking Q6", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 4, model: "Qwen3-30B-Thinking Q6", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 64, vramMin: 0, model: "Qwen3-30B-Thinking Q6", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },

  // Medium RAM (32 GB)
  { ramMin: 32, vramMin: 32, model: "Qwen3-4B-Thinking BF16 or Qwen3-30B-Thinking Q6", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 24, model: "Qwen3-4B-Thinking BF16", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 16, model: "Qwen3-4B-Thinking BF16", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 12, model: "Qwen3-4B-Thinking BF16", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 8, model: "Qwen3-4B-Thinking Q8", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 6, model: "Qwen3-4B-Thinking Q6", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 4, model: "Qwen3-4B-Thinking Q4", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },
  { ramMin: 32, vramMin: 0, model: "Qwen3-4B-Thinking Q6", color: "var(--vp-c-blue-2)", bg: "var(--vp-c-blue-soft)" },

  // Low RAM (16 GB)
  { ramMin: 16, vramMin: 32, model: "Qwen3-4B-Thinking BF16 or Qwen3-30B-Thinking Q6", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 24, model: "Qwen3-4B-Thinking BF16", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 16, model: "Qwen3-4B-Thinking BF16", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 12, model: "Qwen3-4B-Thinking BF16", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 8, model: "Qwen3-4B-Thinking Q8", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 6, model: "Qwen3-4B-Thinking Q6", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  { ramMin: 16, vramMin: 4, model: "Qwen3-4B-Thinking Q4", color: "var(--vp-c-orange-2)", bg: "var(--vp-c-orange-soft)" },
  // vramMin: 0 → "none" → omitted
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

> **“Not recommended” means unreliable STEM output**
> If the selector returns “Not recommended,” your system likely lacks the resources to run even the smallest thinking model effectively. In such cases, output quality degrades severely—often worse than manually reasoning through the problem for 5+ minutes.

---

## How to Use Thinking-Tuned Models for STEM Work

These models are designed for **deep technical reasoning**, not casual conversation. Follow these guidelines to maximize accuracy and performance in scientific, engineering, or mathematical contexts.

### 1. **Use Only Thinking-Tuned Variants**
- Only models labeled **`thinking`** (e.g., `qwen3 4b thinking`, `qwen3 30b thinking`) are fine-tuned for analytical tasks like:
  - Solving differential equations
  - Deriving physics formulas
  - Debugging numerical simulations
  - Explaining quantum mechanics or circuit design
- Standard `instruct` or base models often **fail on multi-step logic** or produce plausible but incorrect STEM conclusions.

### 2. **Understand Quantization Trade-offs**
| Quant | Use Case | STEM Impact |
|------|--------|-----------|
| `bf16` / `f16` | High-precision math, symbolic reasoning | Best for accuracy in calculus, linear algebra, or physics derivations |
| `q8` | Balanced performance | Suitable for most coding + math tasks (e.g., Python + NumPy workflows) |
| `q6` / `q4` | Low-resource systems | May skip steps in proofs or mis-evaluate edge cases—use only when necessary |

### 3. **Full GPU Offload Is Critical**
- **Context lives in VRAM**—always aim for **full GPU offload** (e.g., 48/48 layers in LM Studio).
- If LM Studio suggests default offload settings for a model, **keep them**—they're tuned for stability.

### 4. **RAM+VRAM Combo Rule (For CPU Offload)**
If using partial CPU offload:
```
Total Free RAM + VRAM ≥ Model Size + 4 GB (context + overhead)
```
- Example: `qwen3-30b-thinking-q8` ≈ 36 GB → requires **≥40 GB combined free memory**.
- This setup works but is **not ideal for real-time STEM exploration**—expect latency.

### 5. **Prompt with Precision**
STEM models thrive on **structured, explicit prompts**:
- ❌ _“How do I solve this?”_  
- ✅ _“Given a 2D heat equation ∂u/∂t = α∇²u on [0,1]×[0,1] with Dirichlet BCs, derive the finite difference scheme using central differences and Δx=Δy=0.1.”_
- Include:
  - Known variables & constraints
  - Desired output format (e.g., “show all steps,” “return Python code”)
  - Relevant domain (e.g., “in classical electromagnetism…”)

### 6. **Avoid “None” Configurations**
- If your hardware yields **“none”**, do **not** force a model load via heavy CPU offload.
- You'll get **hallucinated derivations**, incorrect unit conversions, or broken logic—worse than no model at all.
- Alternatives:
  - Use cloud inference (e.g., Together.ai with `qwen3-30b-thinking`)
  - Upgrade to ≥8 GB VRAM for basic STEM tasks

### 7. **Monitor Real-Time Usage**
- **Windows**: Task Manager → Performance → GPU & Memory
- **Linux**: `nvidia-smi` (NVIDIA) or `radeontop` (AMD)
- If VRAM >90% usage, reduce context length or switch to a lower quant (e.g., `bf16` → `q8`).

---

By aligning your hardware capabilities, quantization choice, and prompt engineering with these principles, you'll unlock **reliable, step-by-step technical reasoning**—whether you're proving theorems, simulating systems, or designing experiments.