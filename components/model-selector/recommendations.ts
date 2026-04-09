import { MODEL_NAMES as M } from "./constants/models";
import { QUANTIZATIONS as Q } from "./constants/quantizations";
import { RECOMMENDED_USAGE as U } from "./constants/usage";
import type { RecommendationRule } from "./types";

export const USE_CASE_COPY = {
  coding: {
    title: "Coding Assistants",
    summary: "High-precision code generation, debugging, and refactoring.",
    href: "/recommendations/coding/",
  },
  instruct: {
    title: "Instruct Models",
    summary: "General-purpose chat, task execution, and instruction following.",
    href: "/recommendations/instruct/",
  },
  "personal-assistant": {
    title: "Personal Assistant",
    summary:
      "Private, context-aware assistants for everyday planning and recall.",
    href: "/recommendations/personal-assistant/",
  },
  stem: {
    title: "STEM & Technical Reasoning",
    summary:
      "Analytical models for math, logic, and technical problem-solving.",
    href: "/recommendations/stem/",
  },
  storywriting: {
    title: "Storywriting",
    summary:
      "Narrative-friendly models for prose, dialogue, and long-form creativity.",
    href: "/recommendations/storywriting/",
  },
  vision: {
    title: "Vision",
    summary: "Models for OCR, multimodal reasoning, and image understanding.",
    href: "/recommendations/vision/",
  },
} as const;

export type UseCaseKey = keyof typeof USE_CASE_COPY;

export const DEFAULT_RECOMMENDATION_RULES: RecommendationRule[] = [
  // Coding
  {
    ramMin: 64,
    vramMin: 16,
    usefulness: 1.0,
    models: [
      {
        name: M.QWEN3_CODER_NEXT,
        parameters: 80,
        quantization: Q.Q4_K_M,
        usage: U.CODING,
      },
      {
        name: M.GLM_4_7_FLASH,
        parameters: 30,
        quantization: Q.Q8_K_XL,
        usage: U.CODING,
      },
    ],
  },
  {
    ramMin: 64,
    vramMin: 12,
    usefulness: 0.9,
    models: [
      {
        name: M.QWEN3_CODER_NEXT,
        parameters: 80,
        quantization: Q.Q4_K_M,
        usage: U.CODING,
      },
      {
        name: M.GLM_4_7_FLASH,
        parameters: 30,
        quantization: Q.Q8_K_XL,
        usage: U.CODING,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 16,
    usefulness: 0.8,
    models: [
      {
        name: M.GLM_4_7_FLASH,
        parameters: 30,
        quantization: Q.Q6_K_XL,
        usage: U.CODING,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 6,
    usefulness: 0.7,
    models: [
      {
        name: M.GLM_4_7_FLASH,
        parameters: 30,
        quantization: Q.Q4_K_XL,
        usage: U.CODING,
      },
    ],
  },
  {
    ramMin: 16,
    vramMin: 4,
    usefulness: 0.3,
    models: [
      {
        name: M.QWEN3_4B_INSTRUCT_2507,
        parameters: 4,
        quantization: Q.F16,
        usage: U.CODING,
      },
    ],
  },
  {
    ramMin: 16,
    vramMin: 0,
    usefulness: 0.0,
    models: [
      {
        name: M.QWEN3_4B_INSTRUCT_2507,
        parameters: 4,
        quantization: Q.Q4_K_XL,
        usage: U.CODING,
      },
    ],
  },

  // Instruct
  {
    ramMin: 128,
    vramMin: 32,
    usefulness: 1.0,
    models: [
      {
        name: M.MISTRAL_SMALL_3_2,
        parameters: 24,
        quantization: Q.Q8_K_XL,
        usage: U.INSTRUCT,
      },
      {
        name: M.QWEN3_30B_INSTRUCT_2507,
        parameters: 30,
        quantization: Q.BF16,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 128,
    vramMin: 24,
    usefulness: 0.9,
    models: [
      {
        name: M.MISTRAL_SMALL_3_2,
        parameters: 24,
        quantization: Q.Q6_K_XL,
        usage: U.INSTRUCT,
      },
      {
        name: M.QWEN3_30B_INSTRUCT_2507,
        parameters: 30,
        quantization: Q.BF16,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 128,
    vramMin: 0,
    usefulness: 0.8,
    models: [
      {
        name: M.QWEN3_30B_INSTRUCT_2507,
        parameters: 30,
        quantization: Q.BF16,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 64,
    vramMin: 32,
    usefulness: 0.9,
    models: [
      {
        name: M.MISTRAL_SMALL_3_2,
        parameters: 24,
        quantization: Q.Q8_K_XL,
        usage: U.INSTRUCT,
      },
      {
        name: M.QWEN3_30B_INSTRUCT_2507,
        parameters: 30,
        quantization: Q.BF16,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 64,
    vramMin: 24,
    usefulness: 0.8,
    models: [
      {
        name: M.MISTRAL_SMALL_3_2,
        parameters: 24,
        quantization: Q.Q6_K_XL,
        usage: U.INSTRUCT,
      },
      {
        name: M.QWEN3_30B_INSTRUCT_2507,
        parameters: 30,
        quantization: Q.Q8_K_XL,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 64,
    vramMin: 0,
    usefulness: 0.2,
    models: [
      {
        name: M.QWEN3_30B_INSTRUCT_2507,
        parameters: 30,
        quantization: Q.Q8_K_XL,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 32,
    usefulness: 0.8,
    models: [
      {
        name: M.MISTRAL_SMALL_3_2,
        parameters: 24,
        quantization: Q.Q8_K_XL,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 24,
    usefulness: 0.7,
    models: [
      {
        name: M.MISTRAL_SMALL_3_2,
        parameters: 24,
        quantization: Q.Q6_K_XL,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 16,
    usefulness: 0.6,
    models: [
      {
        name: M.MISTRAL_SMALL_3_2,
        parameters: 24,
        quantization: Q.Q4_K_XL,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 8,
    usefulness: 0.4,
    models: [
      {
        name: M.QWEN3_30B_INSTRUCT_2507,
        parameters: 30,
        quantization: Q.Q6_K_XL,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 4,
    usefulness: 0.3,
    models: [
      {
        name: M.QWEN3_4B_INSTRUCT_2507,
        parameters: 4,
        quantization: Q.BF16,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 16,
    vramMin: 32,
    usefulness: 0.6,
    models: [
      {
        name: M.MISTRAL_SMALL_3_2,
        parameters: 24,
        quantization: Q.Q8_K_XL,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 16,
    vramMin: 24,
    usefulness: 0.5,
    models: [
      {
        name: M.MISTRAL_SMALL_3_2,
        parameters: 24,
        quantization: Q.Q6_K_XL,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 16,
    vramMin: 12,
    usefulness: 0.3,
    models: [
      {
        name: M.QWEN3_4B_INSTRUCT_2507,
        parameters: 4,
        quantization: Q.BF16,
        usage: U.INSTRUCT,
      },
    ],
  },
  {
    ramMin: 16,
    vramMin: 4,
    usefulness: 0.2,
    models: [
      {
        name: M.QWEN3_4B_INSTRUCT_2507,
        parameters: 4,
        quantization: Q.Q4_K_XL,
        usage: U.INSTRUCT,
      },
    ],
  },

  // Personal assistant
  {
    ramMin: 128,
    vramMin: 6,
    usefulness: 1.0,
    models: [
      {
        name: M.QWEN3_5_122B_A10B,
        parameters: 122,
        quantization: Q.Q4_K_M,
        usage: U.PERSONAL_ASSISTANT,
      },
      {
        name: M.GPT_OSS_120B,
        parameters: 120,
        quantization: Q.MXFP4,
        usage: U.PERSONAL_ASSISTANT,
      },
    ],
  },
  {
    ramMin: 64,
    vramMin: 6,
    usefulness: 0.8,
    models: [
      {
        name: M.GPT_OSS_20B,
        parameters: 20,
        quantization: Q.MXFP4,
        usage: U.PERSONAL_ASSISTANT,
      },
      {
        name: M.QWEN3_35B_A3B,
        parameters: 35,
        quantization: Q.Q8_0,
        usage: U.PERSONAL_ASSISTANT,
      },
    ],
  },
  {
    ramMin: 64,
    vramMin: 0,
    usefulness: 0.6,
    models: [
      {
        name: M.GPT_OSS_20B,
        parameters: 20,
        quantization: Q.MXFP4,
        usage: U.PERSONAL_ASSISTANT,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 0,
    usefulness: 0.6,
    models: [
      {
        name: M.GPT_OSS_20B,
        parameters: 20,
        quantization: Q.MXFP4,
        usage: U.PERSONAL_ASSISTANT,
      },
    ],
  },
  {
    ramMin: 16,
    vramMin: 12,
    usefulness: 0.4,
    models: [
      {
        name: M.GPT_OSS_20B,
        parameters: 20,
        quantization: Q.MXFP4,
        usage: U.PERSONAL_ASSISTANT,
      },
    ],
  },
  {
    ramMin: 16,
    vramMin: 8,
    usefulness: 0.3,
    models: [
      {
        name: M.GEMMA_3_12B,
        parameters: 12,
        quantization: Q.Q4_K_XL,
        usage: U.PERSONAL_ASSISTANT,
      },
    ],
  },
  {
    ramMin: 16,
    vramMin: 4,
    usefulness: 0.2,
    models: [
      {
        name: M.QWEN3_4B_INSTRUCT_2507,
        parameters: 4,
        quantization: Q.Q4_K_XL,
        usage: U.PERSONAL_ASSISTANT,
      },
    ],
  },

  // STEM
  {
    ramMin: 128,
    vramMin: 0,
    usefulness: 1.0,
    models: [
      {
        name: M.QWEN3_5_122B_A10B,
        parameters: 122,
        quantization: Q.Q8_K_XL,
        usage: U.STEM,
      },
    ],
  },
  {
    ramMin: 64,
    vramMin: 32,
    usefulness: 0.8,
    models: [
      {
        name: M.QWEN3_5_35B_A3B,
        parameters: 35,
        quantization: Q.Q8_K_XL,
        usage: U.STEM,
      },
    ],
  },
  {
    ramMin: 64,
    vramMin: 12,
    usefulness: 0.6,
    models: [
      {
        name: M.QWEN3_5_35B_A3B,
        parameters: 35,
        quantization: Q.Q8_K_XL,
        usage: U.STEM,
      },
    ],
  },
  {
    ramMin: 64,
    vramMin: 0,
    usefulness: 0.6,
    models: [
      {
        name: M.QWEN3_5_35B_A3B,
        parameters: 35,
        quantization: Q.Q6_K_XL,
        usage: U.STEM,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 24,
    usefulness: 0.8,
    models: [
      {
        name: M.QWEN3_5_35B_A3B,
        parameters: 35,
        quantization: Q.Q8_K_XL,
        usage: U.STEM,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 12,
    usefulness: 0.5,
    models: [
      {
        name: M.QWEN3_4B_THINKING_2507,
        parameters: 4,
        quantization: Q.BF16,
        usage: U.STEM,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 8,
    usefulness: 0.4,
    models: [
      {
        name: M.QWEN3_4B_THINKING_2507,
        parameters: 4,
        quantization: Q.Q8_K_XL,
        usage: U.STEM,
      },
    ],
  },
  {
    ramMin: 16,
    vramMin: 12,
    usefulness: 0.4,
    models: [
      {
        name: M.QWEN3_4B_THINKING_2507,
        parameters: 4,
        quantization: Q.BF16,
        usage: U.STEM,
      },
    ],
  },
  {
    ramMin: 16,
    vramMin: 8,
    usefulness: 0.3,
    models: [
      {
        name: M.QWEN3_4B_THINKING_2507,
        parameters: 4,
        quantization: Q.Q8_K_XL,
        usage: U.STEM,
      },
    ],
  },
  {
    ramMin: 16,
    vramMin: 4,
    usefulness: 0.2,
    models: [
      {
        name: M.QWEN3_4B_THINKING_2507,
        parameters: 4,
        quantization: Q.Q4_K_XL,
        usage: U.STEM,
      },
    ],
  },

  // Storywriting
  {
    ramMin: 128,
    vramMin: 32,
    usefulness: 1.0,
    models: [
      {
        name: M.GLM_4_7_FLASH,
        parameters: 30,
        quantization: Q.Q8_K_XL,
        usage: U.STORYWRITING,
      },
    ],
  },
  {
    ramMin: 128,
    vramMin: 12,
    usefulness: 0.8,
    models: [
      {
        name: M.GLM_4_7_FLASH,
        parameters: 30,
        quantization: Q.Q8_K_XL,
        usage: U.STORYWRITING,
      },
    ],
  },
  {
    ramMin: 64,
    vramMin: 6,
    usefulness: 0.7,
    models: [
      {
        name: M.GLM_4_7_FLASH,
        parameters: 30,
        quantization: Q.Q8_K_XL,
        usage: U.STORYWRITING,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 12,
    usefulness: 0.6,
    models: [
      {
        name: M.GLM_4_7_FLASH,
        parameters: 30,
        quantization: Q.Q4_K_XL,
        usage: U.STORYWRITING,
      },
    ],
  },

  // Vision
  {
    ramMin: 128,
    vramMin: 32,
    usefulness: 0.95,
    models: [
      {
        name: M.QWEN3_VL_235B_INSTRUCT,
        parameters: 235,
        quantization: Q.Q3_K_XL,
        usage: U.VISION,
      },
    ],
  },
  {
    ramMin: 64,
    vramMin: 32,
    usefulness: 0.85,
    models: [
      {
        name: M.QWEN3_VL_32B_INSTRUCT,
        parameters: 32,
        quantization: Q.Q6_K_XL,
        usage: U.VISION,
      },
    ],
  },
  {
    ramMin: 64,
    vramMin: 16,
    usefulness: 0.85,
    models: [
      {
        name: M.QWEN3_5_9B,
        parameters: 9,
        quantization: Q.Q8_K_XL,
        usage: U.VISION,
      },
    ],
  },
  {
    ramMin: 32,
    vramMin: 12,
    usefulness: 0.8,
    models: [
      {
        name: M.QWEN3_VL_8B_INSTRUCT,
        parameters: 8,
        quantization: Q.Q8_K_XL,
        usage: U.VISION,
      },
    ],
  },
];
