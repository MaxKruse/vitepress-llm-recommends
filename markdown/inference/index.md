---
title: Inference
---

# Inference

This section covers inference strategies, optimization techniques, and deployment considerations for AI models—particularly those that can run **locally** on consumer hardware.

> ⚠️ **Important Disclaimer Regarding Ollama**  
> While Ollama offers a convenient interface for running local LLMs, **serious concerns have been raised** about its approach to open source. The project has been criticized for:
> 
> - **Lack of true open-source commitment**: Despite using open weights from community models, Ollama itself is **not fully open source**—its server component is proprietary.
> - **Commercialization of community work**: Ollama packages and redistributes models created and shared by the open-source community, often without clear attribution or contribution back to those projects.
> - **Pattern of behavior**: The founders have a history tied to Docker, a project that similarly started as open-source infrastructure but later shifted toward aggressive commercialization, leaving many community contributors disillusioned.
> 
> Given these issues, **we strongly advise caution**. If you value software freedom, transparency, and sustainable open-source ecosystems, consider using fully open alternatives like `llama.cpp` or transparent tools like `LM Studio`.  
> 
> **Support tools that support the community—not those that extract from it.**

## Local Inference Engines

Running models locally offers privacy, reduced latency, and offline capabilities. Below is a quick guide to popular open-source inference engines and when you might choose each.

### [llama.cpp](https://github.com/ggerganov/llama.cpp)
- **Best for**: Flexible local inference across **CPU-only**, **GPU-only**, or **hybrid CPU+GPU** setups.
- **Pros**: Fully open source, supports a wide range of architectures (x86, ARM, Apple Silicon), and offers multiple backends including CUDA (NVIDIA), Metal (Apple) and Vulkan,. Excellent support for quantized GGUF models, enabling efficient inference even on modest hardware.
- **Use when**: You want maximum control, portability, and performance across diverse hardware—laptops, desktops, servers, or mobile devices.

### [LM Studio](https://lmstudio.ai/)
- **Best for**: Desktop GUI users who want to explore and chat with local models.
- **Pros**: Intuitive interface, model discovery, built-in chat and local server mode.
- **Note**: LM Studio is built on top of **llama.cpp** for Windows/Linux and **MLX** (Apple's machine learning framework) on macOS, giving it strong performance and compatibility with GGUF models while providing a polished user experience.

### [vLLM](https://vllm.readthedocs.io/)
- **Best for**: High-throughput GPU inference (not ideal for low-resource devices).
- **Pros**: Extremely fast, supports continuous batching and PagedAttention.
- **Use when**: You're deploying on a server with one or more powerful NVIDIA GPUs and need scalability and low latency for many concurrent requests.

## Quick Decision Guide

| Scenario                              | Recommended Engine(s)        |
|--------------------------------------|------------------------------|
| CPU-only or mixed CPU/GPU inference  | `llama.cpp`                  |
| Desktop GUI for chatting/testing     | `LM Studio`                  |
| Server deployment with NVIDIA GPU(s) | `vLLM`                       |

> 💡 **Tip**: Most local LLMs today use **quantized** versions (e.g., GGUF, AWQ, GPTQ) to reduce memory usage and run on consumer hardware. Always check model compatibility with your chosen engine.

For up-to-date benchmarks and model support, consult each project's documentation and community resources.