---
title: Recommendations
---

# Recommendations

Choose the right model and hardware setup based on your specific use case. Below are tailored guides for common scenarios:

- [**Coding Assistants**](./coding/)  
  Models and hardware for code generation, autocomplete, and debugging.

- [**Instruction-Following Tasks**](./instruct/)  
  Best choices for chatbots, customer support, and general-purpose assistants.

- [**Personal AI Assistants**](./personal-assistant/)  
  Optimized setups for private, responsive, and context-aware daily use.

- [**STEM & Technical Reasoning**](./stem/)  
  Models with strong math, logic, and scientific reasoning capabilities.

- [**Creative Storywriting**](./storywriting/)  
  Architectures and configurations for long-form, coherent, and imaginative text.

Each guide includes model suggestions, quantization tips, and minimum/recommended hardware specs.

## Parameters, Quantization, and Hallucinations

This section explores the core concepts you'll encounter when working with local LLMs: parameters, quantization, and hallucinations.

### What are Parameters?

In an LLM, **parameters** are the internal variables the model learns during training. Think of them as the neurons and the connections between them. The number of parameters determines the model's capacity to store and process information.

- **Model Size**: Modern models typically become useful out-of-the-box starting around 1-4 billion (B) parameters.
- **Data Precision**: Most models are initially trained in **FP16** (16-bit floating point), meaning each parameter can hold 16 bits of information.

The more parameters a model has, the more potential space there is for information to be learned without "overwriting" previously learned knowledge.

#### The Role of Training

Sadly, as of late 2025, most consumer-level LLMs are heavily undertrained. This becomes evident when we apply quantization (explained below).

To put it simply: if there are 16 bits of space available in a parameter, but on average, only 4 of those bits are effectively used during training, the other 12 bits contribute very little to the final output quality. This is why you'll often see recommendations for extreme quantization methods like **Q4** (an average of 4 bits per parameter) or even lower.

To illustrate the relationship between model size, training, and quantization:

Imagine we take a 4B model and a 70B model from the same family.
1.  We train both on the exact same data for the same number of iterations.
2.  The smaller 4B model might become "full," saturating most of the 16 bits in its 4 billion parameters.
3.  The larger 70B model, with its vast capacity, might only effectively use, let's say, 8 bits of information per parameter on average.

Now, if we quantize both models to **Q4**:
- The 4B model loses a significant amount of its learned data (going from ~16 bits to 4 bits).
- The 70B model is less affected because it was only using ~8 bits of information anyway. Its perceived quality drop is much smaller.

This is why quantizing a massive, undertrained 70B model to Q4 is often less of an issue than quantizing an 8B model of the same family, or comparing it to better-trained models like the **Qwen3 Family (which is NOT undertrained and utilizes all 16 bits very effectively)**.

### What is Quantization?

Quantization is the process of reducing the precision of a model's parameters to save memory and improve performance.

Imagine a single 16-bit parameter (`0011010101110101`) represents the following detailed information:

> Leaves appear green because of chlorophyll, a pigment found inside plant cells (specifically in chloroplasts). Chlorophyll plays a critical role in photosynthesis, the process plants use to convert light energy into chemical energy.
>
> Sunlight contains all wavelengths (colors) of visible light. Chlorophyll absorbs light most efficiently in the blue (~430-450 nm) and red (~640-680 nm) regions of the spectrum, which are used to drive photosynthesis.
>
> However, it reflects and transmits green light (~500-550 nm) rather than absorbing it. Because the green wavelengths are not absorbed, they bounce off the leaf and enter our eyes — that's why we perceive leaves as green.

If we quantize this 16-bit value down to just 4 bits (`0011`), we are essentially "cutting off" the fine-grained details. The model might now only retain enough information to generate a simpler explanation:

> Leaves are green because they have a special color helper inside called chlorophyll.
>
> The leaf uses sunlight to make its food, kind of like how you eat to get energy. Chlorophyll drinks up red and blue sunlight but doesn't like green light — it bounces the green light away.
>
> That's what your eyes see, so the leaf looks green!

By removing detail, you risk losing accuracy. While the quantized model still seems to understand the core concept, it has lost nuance and is more likely to make mistakes or hallucinate.

### What are Hallucinations?

LLMs famously "hallucinate"—they generate confident-sounding but incorrect or nonsensical information. While the exact cause is complex, you can think of it like this:

Imagine you know many different topics, but only at a very surface level. If someone asks you a question that *seems* like it could be answered by combining facts from different topics, you might construct an answer that sounds plausible but is ultimately wrong.

Consider an LLM that has learned the following isolated facts:
1.  Streets are clean because the city pays for cleaning them.
2.  Your house is clean because your parents clean it from time to time.
3.  The local McDonald's is never clean because the workers are too busy.

If you ask the LLM, "Why is my house not clean?" it might correctly infer, "Because your parents are busy."

However, it could also incorrectly combine unrelated facts and produce a hallucination:

> "Your house is not clean because the city is not paying your parents."


# Sources

- **[Parameters](https://www.ibm.com/think/topics/llm-parameters/)**
- **[Quantization](https://www.datacamp.com/tutorial/quantization-for-large-language-models/)**
- **[Hallucinations](https://openai.com/index/why-language-models-hallucinate/)**