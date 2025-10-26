---
title: Storywriting
---

# Storywriting & Creative Writing

**Narrative-tuned models** optimized for immersive storytelling, rich character arcs, evocative prose, and genre-aware stylistic control. These models excel at crafting original fiction, expanding existing worlds, generating dialogue with emotional nuance, and maintaining long-range plot coherence—even across tens of thousands of tokens.

Use the selector below to find the best **creative-writing-optimized** model for your hardware:


<script setup>
import ModelSelector from '../../../components/ModelSelector.vue'
const models = [
  { ramMin: 128, vramMin: 32, models: [{"GPT OSS 120B": { parameters: 120, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q8_K_XL' }}], usefulness: 1.0},
  { ramMin: 128, vramMin: 16, models: [{"GPT OSS 120B": { parameters: 120, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q4_K_XL' }}], usefulness: 0.9},
  { ramMin: 128, vramMin: 12, models: [{"GPT OSS 120B": { parameters: 120, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q6_K_XL' }}], usefulness: 0.8},
  { ramMin: 128, vramMin: 0, models: [{"GPT OSS 120B": { parameters: 120, quantization: 'MXFP4' }}], usefulness: 0.7},

  { ramMin: 64, vramMin: 32, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q8_K_XL' }}], usefulness: 0.8},
  { ramMin: 64, vramMin: 24, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q6_K_XL' }}], usefulness: 0.7},
  { ramMin: 64, vramMin: 12, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q6_K_XL' }}], usefulness: 0.6},
  { ramMin: 64, vramMin: 0, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}], usefulness: 0.5},

  { ramMin: 32, vramMin: 32, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q8_K_XL' }}], usefulness: 0.7},
  { ramMin: 32, vramMin: 24, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q6_K_XL' }}], usefulness: 0.6},
  { ramMin: 32, vramMin: 16, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q8_K_XL' }}], usefulness: 0.5},
  { ramMin: 32, vramMin: 12, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q6_K_XL' }}], usefulness: 0.4},
  { ramMin: 32, vramMin: 8, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q4_K_XL' }}], usefulness: 0.3},
  { ramMin: 32, vramMin: 6, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}], usefulness: 0.25},

  { ramMin: 16, vramMin: 32, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q8_K_XL' }}], usefulness: 0.5},
  { ramMin: 16, vramMin: 24, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q6_K_XL' }}], usefulness: 0.4},
  { ramMin: 16, vramMin: 16, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q8_K_XL' }}], usefulness: 0.3},
  { ramMin: 16, vramMin: 12, models: [{"GPT OSS 20B": { parameters: 20, quantization: 'MXFP4' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q6_K_XL' }}], usefulness: 0.25},
  { ramMin: 16, vramMin: 8, models: [{"Gemma 3 12B": { parameters: 12, quantization: 'Q4_K_XL' }}], usefulness: 0.2},
]

</script>

<ModelSelector :modelDefinitions="models" />


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