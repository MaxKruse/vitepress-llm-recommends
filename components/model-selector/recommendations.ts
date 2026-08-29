import { MODEL_NAMES as M } from "./constants/models";
import { QUANTIZATIONS as Q } from "./constants/quantizations";
import { RECOMMENDED_USAGE as U } from "./constants/usage";
import type { ModelCandidate, RecommendationRule } from "./types";
import type { ModelName } from "./constants/models";

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
  defineModel(M.LFM2_5_8B_A1B, {
    [Q.Q4_K_M]: U.INSTRUCT,
  }),
  defineModel(M.GEMMA_4_12B, {
    [Q.Q4_K_M]: combine(U.INSTRUCT, U.PERSONAL_ASSISTANT),
  }),
  defineModel(M.QWEN3_8_27B, {
    [Q.Q4_K_M]: combine(U.INSTRUCT, U.CODING, U.VISION),
    [Q.Q6_K_XL]: U.CODING,
  }),
  defineModel(M.MUSE_GLIMMER_30B, {
    [Q.Q4_K_XL]: combine(
      U.CODING,
      U.INSTRUCT,
      U.PERSONAL_ASSISTANT,
      U.VISION,
    ),
  }),
  defineModel(M.GEMMA_4_26B_A4B, {
    [Q.Q4_K_M]: combine(U.INSTRUCT, U.STORYWRITING, U.PERSONAL_ASSISTANT),
  }),
  defineModel(M.QWEN3_6_35B_A3B, {
    [Q.Q4_K_M]: combine(U.STEM, U.INSTRUCT, U.CODING, U.VISION),
  }),
  defineModel(M.QWEN3_8_FLASH_NEXT, {
    [Q.Q4_K_XL]: combine(U.CODING, U.VISION),
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

  const floor = MODEL_HARDWARE_FLOORS[selection.name];
  const candidate = model(selection.name, selection.quantization, usage);

  return floor
    ? { ...candidate, ramMin: floor.ramMin, vramMin: floor.vramMin }
    : candidate;
}

// Mandatory per-model hardware floor, independent of whether the model
// physically fits: Flash-Next is a ~180B MoE, and below 128 GB RAM +
// 32 GB VRAM it is not usable in practice, so it is only recommended
// for that hardware class.
const MODEL_HARDWARE_FLOORS: Partial<
  Record<ModelName, { ramMin: number; vramMin: number }>
> = {
  [M.QWEN3_8_FLASH_NEXT]: { ramMin: 128, vramMin: 32 },
};

export const DEFAULT_RECOMMENDATION_RULES: RecommendationRule[] = [
  {
    models: MODEL_RECOMMENDATION_PROFILES.flatMap((profile) =>
      (Object.keys(profile.usageByQuantization) as Array<
        ModelCandidate["quantization"]
      >).map((quantization) =>
        candidateFromSelection({ name: profile.name, quantization }),
      ),
    ),
  },
];
