import { MODEL_NAMES as M } from "./constants/models";
import { QUANTIZATIONS as Q } from "./constants/quantizations";
import { RECOMMENDED_USAGE as U } from "./constants/usage";
import type { ModelCandidate, RecommendationRule } from "./types";
import { getModelParameterSize } from "./constants/models";
import { calculateFileSizeGb } from "./utils";

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

const RAM_TIERS_GB = [16, 32, 64] as const;
const VRAM_TIERS_GB = [8, 12, 16, 24, 32] as const;

const SYSTEM_VRAM_OVERHEAD_GB = 1;
const CONTEXT_OVERHEAD_GB = 3;

const getSystemRamOverheadGb = (ramTierGb: number): number => {
  if (ramTierGb <= 16) {
    return 6;
  }

  if (ramTierGb <= 32) {
    return 8;
  }

  return 12;
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
  defineModel(M.QWEN3_5_9B, {
    [Q.Q4_K_M]: combine(U.STEM, U.CODING, U.VISION),
  }),
  defineModel(M.LFM2_5_8B_A1B, {
    [Q.Q4_K_M]: U.INSTRUCT,
  }),
  defineModel(M.GEMMA_4_12B, {
    [Q.Q4_K_M]: combine(U.INSTRUCT, U.PERSONAL_ASSISTANT),
  }),
  defineModel(M.QWEN3_6_35B_A3B, {
    [Q.Q4_K_M]: combine(U.STEM, U.INSTRUCT, U.CODING, U.VISION),
  }),
  defineModel(M.GEMMA_4_26B_A4B, {
    [Q.Q4_K_M]: combine(U.INSTRUCT, U.STORYWRITING, U.PERSONAL_ASSISTANT),
  }),
  defineModel(M.QWEN3_6_27B, {
    [Q.Q4_K_M]: combine(U.INSTRUCT, U.CODING, U.VISION),
    [Q.Q6_K_XL]: U.CODING,
  }),
  defineModel(M.GEMMA_4_31B, {
    [Q.Q4_K_M]: combine(U.INSTRUCT, U.STORYWRITING, U.PERSONAL_ASSISTANT),
  }),
  defineModel(M.QWEN3_CODER_NEXT, {
    [Q.Q4_K_M]: U.CODING,
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

function pickTier(
  requiredModelGb: number,
  tiers: readonly number[],
  overheadGb: number,
): number {
  for (const tier of tiers) {
    const availableForModel = tier - overheadGb;

    if (availableForModel >= requiredModelGb) {
      return tier;
    }
  }

  const fallback = tiers[tiers.length - 1];

  if (fallback === undefined) {
    throw new Error("At least one hardware tier must be configured.");
  }

  return fallback;
}

function pickRamTier(requiredModelGb: number): number {
  for (const tier of RAM_TIERS_GB) {
    const availableForModel = tier - getSystemRamOverheadGb(tier);

    if (availableForModel >= requiredModelGb) {
      return tier;
    }
  }

  const fallback = RAM_TIERS_GB[RAM_TIERS_GB.length - 1];

  if (fallback === undefined) {
    throw new Error("At least one RAM tier must be configured.");
  }

  return fallback;
}

function isMoEModel(modelName: string): boolean {
  return /\bA\d+B\b/i.test(modelName) || modelName === "Qwen3 Coder Next";
}

function getTierForSelection(selection: ModelSelection): RecommendationTier {
  const parameters = getModelParameterSize(selection.name);
  const fileSizeGb = calculateFileSizeGb(
    parameters,
    selection.quantization,
    selection.name,
  );
  const totalGb = fileSizeGb + CONTEXT_OVERHEAD_GB;

  if (isMoEModel(selection.name)) {
    // Tier by total memory (file + context) for offload.
    // RAM needed: assume minimum VRAM tier contributes, rest comes from RAM.
    const vramAtMinTier = VRAM_TIERS_GB[0] - SYSTEM_VRAM_OVERHEAD_GB;
    const ramNeeded = Math.max(0, totalGb - vramAtMinTier);

    return {
      ramMin: pickRamTier(ramNeeded),
      vramMin: VRAM_TIERS_GB[0], // 8 GB — filter does real offload check
      picks: [selection],
    };
  }

  // Dense: tier by total size (file + context). Model must fit entirely in VRAM.
  return {
    ramMin: pickRamTier(0),
    vramMin: pickTier(totalGb, VRAM_TIERS_GB, SYSTEM_VRAM_OVERHEAD_GB),
    picks: [selection],
  };
}

function buildRecommendationTiers(): RecommendationTier[] {
  const tiersByHardware = new Map<string, RecommendationTier>();

  for (const profile of MODEL_RECOMMENDATION_PROFILES) {
    const quantizations = Object.keys(profile.usageByQuantization) as Array<
      ModelCandidate["quantization"]
    >;

    for (const quantization of quantizations) {
      const selection = pick(profile.name, quantization);
      const tier = getTierForSelection(selection);
      const key = `${tier.ramMin}:${tier.vramMin}`;
      const existingTier = tiersByHardware.get(key);

      if (existingTier) {
        existingTier.picks.push(selection);
        continue;
      }

      tiersByHardware.set(key, tier);
    }
  }

  return [...tiersByHardware.values()].sort(
    (left, right) => left.ramMin - right.ramMin || left.vramMin - right.vramMin,
  );
}

const RECOMMENDATION_TIERS: RecommendationTier[] = buildRecommendationTiers();

export const DEFAULT_RECOMMENDATION_RULES: RecommendationRule[] =
  RECOMMENDATION_TIERS.map((tier) => ({
    ramMin: tier.ramMin,
    vramMin: tier.vramMin,
    models: tier.picks.map(candidateFromSelection),
  }));
