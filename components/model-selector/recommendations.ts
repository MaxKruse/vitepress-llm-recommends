import { MODEL_NAMES as M } from "./constants/models";
import { QUANTIZATIONS as Q } from "./constants/quantizations";
import { RECOMMENDED_USAGE as U } from "./constants/usage";
import type { ModelCandidate, RecommendationRule } from "./types";

const model = (
  name: ModelCandidate["name"],
  quantization: ModelCandidate["quantization"],
  usage: ModelCandidate["usage"],
): ModelCandidate => ({
  name,
  quantization,
  usage,
});

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
  // Coding Models - Big to small
  {
    ramMin: 64,
    vramMin: 12,
    models: [model(M.QWEN3_CODER_NEXT, Q.Q4_K_M, U.CODING)],
  },
  {
    ramMin: 32,
    vramMin: 8,
    models: [model(M.GLM_4_7_FLASH, Q.Q4_K_M, U.CODING | U.STORYWRITING)],
  },
  // Instruct Models - Big to small
  {
    ramMin: 64,
    vramMin: 16,
    models: [
      model(M.MISTRAL_SMALL_3_2, Q.Q4_K_M, U.INSTRUCT),
      model(
        M.GEMMA_4_31B,
        Q.Q4_K_M,
        U.INSTRUCT | U.STORYWRITING | U.PERSONAL_ASSISTANT,
      ),
    ],
  },
  {
    ramMin: 64,
    vramMin: 12,
    models: [
      model(
        M.GEMMA_4_26B_A4B,
        Q.Q8_0,
        U.INSTRUCT | U.STORYWRITING | U.PERSONAL_ASSISTANT,
      ),
    ],
  },
  {
    ramMin: 32,
    vramMin: 8,
    models: [
      model(
        M.QWEN3_5_35B_A3B,
        Q.Q4_K_M,
        U.INSTRUCT | U.PERSONAL_ASSISTANT | U.STEM,
      ),
      model(M.QWEN3_4B_INSTRUCT_2507, Q.Q8_0, U.INSTRUCT),
    ],
  },

  // Personal Assistant Models - Big to small
  {
    ramMin: 64,
    vramMin: 32,
    models: [
      model(M.QWEN3_5_122B_A10B, Q.Q4_K_M, U.PERSONAL_ASSISTANT | U.STEM),
      model(
        M.GEMMA_4_31B,
        Q.Q6_K_XL,
        U.INSTRUCT | U.STORYWRITING | U.PERSONAL_ASSISTANT,
      ),
    ],
  },
  {
    ramMin: 64,
    vramMin: 12,
    models: [
      model(
        M.GEMMA_4_26B_A4B,
        Q.Q8_0,
        U.INSTRUCT | U.STORYWRITING | U.PERSONAL_ASSISTANT,
      ),
      model(M.QWEN3_5_35B_A3B, Q.Q8_0, U.INSTRUCT | U.PERSONAL_ASSISTANT),
    ],
  },
  {
    ramMin: 32,
    vramMin: 8,
    models: [
      model(M.QWEN3_5_35B_A3B, Q.Q4_K_M, U.PERSONAL_ASSISTANT),
      model(M.GPT_OSS_20B, Q.MXFP4, U.PERSONAL_ASSISTANT),
    ],
  },
  // STEM and Reasoning
  {
    ramMin: 64,
    vramMin: 24,

    models: [model(M.QWEN3_5_122B_A10B, Q.Q4_K_M, U.STEM)],
  },
  // Storywriting/RP
  {
    ramMin: 64,
    vramMin: 32,
    models: [
      model(M.MISTRAL_SMALL_4, Q.Q4_K_M, U.STORYWRITING),
      model(M.GEMMA_4_31B, Q.Q8_0, U.STORYWRITING),
    ],
  },
  {
    ramMin: 64,
    vramMin: 12,
    models: [
      model(M.GLM_4_7_FLASH, Q.Q4_K_M, U.STORYWRITING),
      model(M.GEMMA_4_26B_A4B, Q.Q8_0, U.STORYWRITING),
    ],
  },
  {
    ramMin: 32,
    vramMin: 8,
    models: [
      model(M.GLM_4_7_FLASH, Q.Q4_K_M, U.STORYWRITING),
      model(M.GEMMA_4_26B_A4B, Q.Q4_K_M, U.STORYWRITING),
    ],
  },
  // Vision Tasks
  {
    ramMin: 64,
    vramMin: 32,
    models: [model(M.QWEN3_VL_32B_INSTRUCT, Q.Q6_K_XL, U.VISION)],
  },
  {
    ramMin: 32,
    vramMin: 12,
    models: [model(M.QWEN3_VL_8B_INSTRUCT, Q.Q4_K_M, U.VISION)],
  },
  {
    ramMin: 32,
    vramMin: 8,
    models: [model(M.QWEN3_VL_4B_INSTRUCT, Q.Q4_K_M, U.VISION)],
  },
] as const satisfies RecommendationRule[];
