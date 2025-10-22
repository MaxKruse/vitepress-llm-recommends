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

const ramOptions = [16, 32, 64, 128]
const vramOptions = [0, 4, 6, 8, 12, 16, 24, 32]

const matrix = [
  ["none", "qwen3 4b thinking q4", "qwen3 4b thinking q6", "qwen3 4b thinking q8", "qwen3 4b thinking bf16", "qwen3 4b thinking bf16", "qwen3 4b thinking bf16", "qwen3 4b thinking bf16 or qwen3 30b thinking q6"],
  ["qwen3 4b thinking q6", "qwen3 4b thinking q4", "qwen3 4b thinking q6", "qwen3 4b thinking q8", "qwen3 4b thinking bf16", "qwen3 4b thinking bf16", "qwen3 4b thinking bf16", "qwen3 4b thinking bf16 or qwen3 30b thinking q6"],
  ["qwen3 30b thinking q6", "qwen3 30b thinking q6", "qwen3 30b thinking q6", "qwen3 30b thinking q6", "qwen3 30b thinking q8", "qwen3 30b thinking q8", "qwen3 30b thinking q8", "qwen3 30b thinking bf16"],
  ["qwen3 30b thinking bf16", "qwen3 30b thinking bf16", "qwen3 30b thinking bf16", "qwen3 30b thinking bf16", "qwen3 30b thinking bf16", "qwen3 30b thinking bf16", "qwen3 30b thinking bf16", "qwen3 30b thinking bf16"]
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
    <strong>Recommended thinking-tuned model for STEM:</strong>
    <span
      class="model-name"
      :class="isRecommended ? 'recommended' : 'not-recommended'"
    >
      {{ recommendedModel }}
    </span>
  </div>
</div>

> ⚠️ **“Not recommended” means unreliable STEM output**  
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