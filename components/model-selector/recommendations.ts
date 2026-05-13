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

type ModelUsageByQuantization = Partial<
  Record<ModelCandidate["quantization"], ModelCandidate["usage"]>
>;

type ModelRecommendationProfile = {
  name: ModelCandidate["name"];
  usageByQuantization: ModelUsageByQuantization;
};

type ModelSelection = {
  name: ModelCandidate["name"];
  quantization: ModelCandidate["quantization"];
};

type RecommendationTier = {
  ramMin: number;
  vramMin: number;
  picks: ModelSelection[];
};

const combine = (
  ...usage: ModelCandidate["usage"][]
): ModelCandidate["usage"] => usage.reduce((mask, value) => mask | value, 0);

const defineModel = (
  name: ModelCandidate["name"],
  usageByQuantization: ModelUsageByQuantization,
): ModelRecommendationProfile => ({
  name,
  usageByQuantization,
});

const pick = (
  name: ModelCandidate["name"],
  quantization: ModelCandidate["quantization"],
): ModelSelection => ({
  name,
  quantization,
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

const MODEL_RECOMMENDATION_PROFILES = [
  defineModel(M.QWEN3_CODER_NEXT, {
    [Q.Q4_K_M]: U.CODING,
  }),
  defineModel(M.GLM_4_7_FLASH, {
    [Q.Q4_K_M]: combine(U.CODING),
  }),
  defineModel(M.GEMMA_4_26B_A4B, {
    [Q.Q4_K_M]: combine(U.INSTRUCT, U.STORYWRITING, U.PERSONAL_ASSISTANT),
  }),
  defineModel(M.QWEN3_6_35B_A3B, {
    [Q.Q4_K_M]: combine(U.INSTRUCT, U.PERSONAL_ASSISTANT, U.STEM),
  }),
  defineModel(M.QWEN3_6_27B, {
    [Q.Q4_K_M]: combine(U.INSTRUCT, U.CODING),
  }),
  defineModel(M.QWEN3_5_122B_A10B, {
    [Q.Q4_K_M]: combine(U.PERSONAL_ASSISTANT, U.STEM, U.CODING),
  }),
  defineModel(M.GPT_OSS_20B, {
    [Q.MXFP4]: U.PERSONAL_ASSISTANT,
  }),
  defineModel(M.MISTRAL_SMALL_4, {
    [Q.Q4_K_M]: U.STORYWRITING,
  }),
  defineModel(M.QWEN3_VL_32B_INSTRUCT, {
    [Q.Q6_K_XL]: combine(U.VISION, U.INSTRUCT, U.PERSONAL_ASSISTANT),
  }),
  defineModel(M.QWEN3_VL_8B_INSTRUCT, {
    [Q.Q4_K_M]: combine(U.VISION, U.INSTRUCT),
  }),
  defineModel(M.QWEN3_VL_4B_INSTRUCT, {
    [Q.Q4_K_M]: combine(U.VISION, U.INSTRUCT),
  }),
  defineModel(M.QWEN3_4B_INSTRUCT_2507, {
    [Q.Q8_0]: U.INSTRUCT,
  }),
] as const satisfies readonly ModelRecommendationProfile[];

const profileByModel = new Map(
  MODEL_RECOMMENDATION_PROFILES.map((profile) => [profile.name, profile]),
);

function candidateFromSelection(selection: ModelSelection): ModelCandidate {
  const profile = profileByModel.get(selection.name);

  if (!profile) {
    throw new Error(
      `Missing recommendation profile for model: ${selection.name}`,
    );
  }

  const usage = profile.usageByQuantization[selection.quantization];

  if (usage === undefined) {
    throw new Error(
      `Missing usage mapping for ${selection.name} at ${selection.quantization}`,
    );
  }

  return model(selection.name, selection.quantization, usage);
}

const RECOMMENDATION_TIERS: RecommendationTier[] = [
  // Coding Models - Big to small
  {
    ramMin: 64,
    vramMin: 12,
    picks: [pick(M.QWEN3_CODER_NEXT, Q.Q4_K_M)],
  },
  {
    ramMin: 32,
    vramMin: 8,
    picks: [pick(M.GLM_4_7_FLASH, Q.Q4_K_M)],
  },
  // Instruct Models - Big to small
  {
    ramMin: 64,
    vramMin: 16,
    picks: [pick(M.MISTRAL_SMALL_3_2, Q.Q4_K_M), pick(M.GEMMA_4_31B, Q.Q4_K_M)],
  },
  {
    ramMin: 64,
    vramMin: 12,
    picks: [pick(M.GEMMA_4_26B_A4B, Q.Q8_0)],
  },
  {
    ramMin: 32,
    vramMin: 8,
    picks: [
      pick(M.QWEN3_6_35B_A3B, Q.Q4_K_M),
      pick(M.QWEN3_4B_INSTRUCT_2507, Q.Q8_0),
    ],
  },
  // Personal Assistant Models - Big to small
  {
    ramMin: 64,
    vramMin: 32,
    picks: [
      pick(M.QWEN3_5_122B_A10B, Q.Q4_K_M),
      pick(M.GEMMA_4_31B, Q.Q6_K_XL),
    ],
  },
  {
    ramMin: 64,
    vramMin: 12,
    picks: [pick(M.GEMMA_4_26B_A4B, Q.Q8_0), pick(M.QWEN3_6_35B_A3B, Q.Q8_0)],
  },
  {
    ramMin: 32,
    vramMin: 8,
    picks: [pick(M.QWEN3_6_35B_A3B, Q.Q4_K_M), pick(M.GPT_OSS_20B, Q.MXFP4)],
  },
  // STEM and Reasoning
  {
    ramMin: 64,
    vramMin: 24,
    picks: [pick(M.QWEN3_5_122B_A10B, Q.Q4_K_M)],
  },
  // Storywriting/RP
  {
    ramMin: 64,
    vramMin: 32,
    picks: [pick(M.MISTRAL_SMALL_4, Q.Q4_K_M), pick(M.GEMMA_4_31B, Q.Q8_0)],
  },
  {
    ramMin: 64,
    vramMin: 12,
    picks: [pick(M.GLM_4_7_FLASH, Q.Q4_K_M), pick(M.GEMMA_4_26B_A4B, Q.Q8_0)],
  },
  {
    ramMin: 32,
    vramMin: 8,
    picks: [pick(M.GLM_4_7_FLASH, Q.Q4_K_M), pick(M.GEMMA_4_26B_A4B, Q.Q4_K_M)],
  },
  // Vision Tasks
  {
    ramMin: 64,
    vramMin: 32,
    picks: [pick(M.QWEN3_VL_32B_INSTRUCT, Q.Q6_K_XL)],
  },
  {
    ramMin: 32,
    vramMin: 12,
    picks: [pick(M.QWEN3_VL_8B_INSTRUCT, Q.Q4_K_M)],
  },
  {
    ramMin: 32,
    vramMin: 8,
    picks: [pick(M.QWEN3_VL_4B_INSTRUCT, Q.Q4_K_M)],
  },
];

export const DEFAULT_RECOMMENDATION_RULES: RecommendationRule[] =
  RECOMMENDATION_TIERS.map((tier) => ({
    ramMin: tier.ramMin,
    vramMin: tier.vramMin,
    models: tier.picks.map(candidateFromSelection),
  }));
