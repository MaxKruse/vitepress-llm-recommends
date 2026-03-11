---
title: Storywriting
---

# Storywriting & Creative Writing

**Narrative-tuned models** optimized for immersive storytelling, rich character arcs, evocative prose, and genre-aware stylistic control. These models excel at crafting original fiction, expanding existing worlds, generating dialogue with emotional nuance, and maintaining long-range plot coherence—even across tens of thousands of tokens.

Use the selector below to find the best **creative-writing-optimized** model for your hardware:


<script setup>
import ModelSelector from '../../../components/ModelSelector.vue'
const models = [
  {
    ramMin: 128,
    vramMin: 32,
    models: [{
        "GLM4.7-Flash": {
            parameters: 30,
            quantization: 'Q8_K_XL'
        }
    }],
    usefulness: 1.0
  },
  {
    ramMin: 128,
    vramMin: 12,
    models: [{
        "GLM4.7-Flash": {
            parameters: 30,
            quantization: 'Q8_K_XL'
        }
    }],
    usefulness: 0.8
  },
  {
    ramMin: 64,
    vramMin: 6,
    models: [{
        "GLM4.7-Flash": {
            parameters: 30,
            quantization: 'Q8_K_XL'
        }
    }],
    usefulness: 0.7
  },
  {
    ramMin: 32,
    vramMin: 12,
    models: [{
        "GLM4.7-Flash": {
            parameters: 30,
            quantization: 'Q4_K_XL'
        }
    }],
    usefulness: 0.6
  },
]

</script>

<ModelSelector :modelDefinitions="models" :context="1024*16" />


