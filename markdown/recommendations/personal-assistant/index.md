---
title: Personal Assistant
---

# Personal Assistant Use Case

Recommendations for models that excel at memory, context retention, and personalized interactions.

> 💡 **Note**: For personal assistant tasks—such as recalling preferences, maintaining conversation history, managing schedules, or adapting tone over time—**instruct-tuned models with strong long-context handling** are preferred over thinking-tuned variants. These models prioritize coherence, empathy, and user-specific adaptation over raw analytical power.

Use the selector below to find the best **assistant-like** model for your hardware:



<script setup>
import ModelSelector from '../../../components/ModelSelector.vue'
const models = [
  { ramMin: 128, vramMin: 32, models: [{"GPT OSS": { parameters: 120, quantization: 'Q4_K_M' }}, {"Qwen3 30B Instruct": { parameters: 30, quantization: 'BF16' }}, {"Mistral Small 3.2": { parameters: 24, quantization: 'Q8_0' }}], usefulness: 1.0},
  { ramMin: 128, vramMin: 24, models: [{"GPT OSS": { parameters: 120, quantization: 'Q4_K_M' }}, {"Qwen3 30B Instruct": { parameters: 30, quantization: 'BF16' }}, {"Mistral Small 3.2": { parameters: 24, quantization: 'Q6_K_M' }}], usefulness: 0.9},
  { ramMin: 128, vramMin: 0, models: [{"GPT OSS": { parameters: 120, quantization: 'Q4_K_M' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 0.8},

  { ramMin: 64, vramMin: 24, models: [{"GPT OSS": { parameters: 20, quantization: 'Q4_K_M' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'BF16' }}], usefulness: 0.8},
  { ramMin: 64, vramMin: 0, models: [{"GPT OSS": { parameters: 20, quantization: 'Q4_K_M' }}, {"Qwen3 30B Instruct 2507": { parameters: 30, quantization: 'Q8_0' }}], usefulness: 0.6},

  { ramMin: 32, vramMin: 24, models: [{"GPT OSS": { parameters: 20, quantization: 'Q4_K_M' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q4_K_M' }}], usefulness: 0.7},
  { ramMin: 32, vramMin: 8, models: [{"GPT OSS": { parameters: 20, quantization: 'Q4_K_M' }}, {"Gemma 3 12B": { parameters: 12, quantization: 'Q6_K_M' }}], usefulness: 0.5},
  { ramMin: 32, vramMin: 0, models: [{"GPT OSS": { parameters: 20, quantization: 'Q4_K_M' }}], usefulness: 0.4},

  { ramMin: 16, vramMin: 32, models: [{"GPT OSS": { parameters: 20, quantization: 'Q4_K_M' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q8_0' }}], usefulness: 0.6},
  { ramMin: 16, vramMin: 24, models: [{"GPT OSS": { parameters: 20, quantization: 'Q4_K_M' }}, {"Gemma 3 27B": { parameters: 27, quantization: 'Q4_K_M' }}], usefulness: 0.5},
  { ramMin: 16, vramMin: 12, models: [{"GPT OSS": { parameters: 20, quantization: 'Q4_K_M' }}], usefulness: 0.4},
  { ramMin: 16, vramMin: 8, models: [{"Gemma 3 12B": { parameters: 12, quantization: 'Q4_K_M' }}], usefulness: 0.3},
  { ramMin: 16, vramMin: 4, models: [{"Qwen3 4B": { parameters: 4, quantization: 'Q4_K_M' }}], usefulness: 0.2},
]

</script>

<ModelSelector :modelDefinitions="models" />

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