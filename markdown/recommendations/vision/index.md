---
title: Vision (OCR + other)
---

# Vision

**Vision Enabled Models**, for explaining images, doing OCR, extracting Text, and other vision tasks. 

Use the selector below to find the best **Vision** model for your hardware:


<script setup>
import ModelSelector from '../../../components/ModelSelector.vue'
const models = [

    {
        ramMin: 128,
        vramMin: 32,
        models: [{
            "Qwen3 VL 235B Instruct": {
                parameters: 235,
                quantization: 'Q3_K_XL'
            }
        }],
        usefulness: 0.95
    },
    {
        ramMin: 64,
        vramMin: 32,
        models: [{
            "Qwen3 VL 32B Instruct": {
                parameters: 32,
                quantization: 'Q6_K_XL'
            }
        }],
        usefulness: 0.85
    },
    {
        ramMin: 64,
        vramMin: 16,
        models: [{
            "Qwen3.5 9B": {
                parameters: 9,
                quantization: 'Q8_K_XL'
            }
        }],
        usefulness: 0.85
    },
    {
        ramMin: 32,
        vramMin: 12,
        models: [{
            "Qwen3 VL 8B Instruct": {
                parameters: 8,
                quantization: 'Q8_K_XL'
            }
        }],
        usefulness: 0.8
    },

]

</script>

<ModelSelector :modelDefinitions="models" :context="1024*8" />


