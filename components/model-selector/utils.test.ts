import { describe, expect, it } from "bun:test";

import { MODEL_NAMES as M, getModelParameterSize } from "./constants/models";
import type { ModelName } from "./constants/models";
import { QUANTIZATIONS as Q } from "./constants/quantizations";
import { RECOMMENDED_USAGE as U } from "./constants/usage";
import { DEFAULT_RECOMMENDATION_RULES } from "./recommendations";
import type { RecommendationRule } from "./types";
import {
  calculateFileSizeGb,
  getLmStudioUri,
  getMatchingRecommendations,
  getUsageHighlightState,
} from "./utils";

// Actual GGUF file sizes sourced from Hugging Face via HEAD requests (May 2026).
// Tolerance is ±8 % to allow for minor upstream file changes without false failures.
const ACTUAL_GGUF_SIZES_GB: Array<{
  name: ModelName;
  quantization: string;
  actualGb: number;
}> = [
  { name: M.QWEN3_5_9B, quantization: Q.Q4_K_M, actualGb: 5.18 },
  { name: M.LFM2_5_8B_A1B, quantization: Q.Q4_K_M, actualGb: 4.60 },
  { name: M.QWEN3_6_35B_A3B, quantization: Q.Q4_K_M, actualGb: 20.61 },
  { name: M.QWEN3_6_27B, quantization: Q.Q4_K_M, actualGb: 15.66 },
  { name: M.QWEN3_6_27B, quantization: Q.Q6_K_XL, actualGb: 23.18 },
  { name: M.QWEN3_CODER_NEXT, quantization: Q.Q4_K_M, actualGb: 45.92 },
  { name: M.GEMMA_4_12B, quantization: Q.Q4_K_M, actualGb: 6.90 },
  { name: M.GEMMA_4_26B_A4B, quantization: Q.Q4_K_M, actualGb: 15.78 },
  { name: M.GEMMA_4_31B, quantization: Q.Q4_K_M, actualGb: 17.83 },
];

const EXPECTED_MODEL_QUANTIZATION_ENTRIES = [
  { name: M.QWEN3_5_9B, quantization: Q.Q4_K_M },
  { name: M.LFM2_5_8B_A1B, quantization: Q.Q4_K_M },
  { name: M.QWEN3_6_35B_A3B, quantization: Q.Q4_K_M },
  { name: M.QWEN3_6_27B, quantization: Q.Q4_K_M },
  { name: M.QWEN3_6_27B, quantization: Q.Q6_K_XL },
  { name: M.GEMMA_4_12B, quantization: Q.Q4_K_M },
  { name: M.GEMMA_4_26B_A4B, quantization: Q.Q4_K_M },
  { name: M.GEMMA_4_31B, quantization: Q.Q4_K_M },
  { name: M.QWEN3_CODER_NEXT, quantization: Q.Q4_K_M },
] as const;

describe("getMatchingRecommendations", () => {
  it("derives parameter size from the model name and prefers the largest matching quantization for duplicate entries", () => {
    const rules: RecommendationRule[] = [
      {
        ramMin: 16,
        vramMin: 8,
        models: [
          {
            name: M.QWEN3_6_27B,
            quantization: Q.Q4_K_XL,
            usage: U.CODING,
          },
        ],
      },
      {
        ramMin: 16,
        vramMin: 24,
        models: [
          {
            name: M.QWEN3_6_27B,
            quantization: Q.Q8_K_XL,
            usage: U.INSTRUCT,
          },
        ],
      },
    ];

    const [recommendation] = getMatchingRecommendations(64, 40, rules);

    expect(recommendation?.parameters).toBe(27);
    expect(recommendation?.quantization).toBe(Q.Q8_K_XL);
    expect(recommendation?.usage).toBe(U.CODING | U.INSTRUCT);
  });

  it("provides an LM Studio link for every recommended model", () => {
    const recommendedModelNames = new Set(
      DEFAULT_RECOMMENDATION_RULES.flatMap((rule) =>
        rule.models.map((candidate) => candidate.name),
      ),
    );

    expect(recommendedModelNames.size).toBeGreaterThan(0);

    for (const modelName of recommendedModelNames) {
      expect(getLmStudioUri(modelName)).not.toBeNull();
    }
  });

  it("filters out dense models that exceed available VRAM", () => {
    const matches = getMatchingRecommendations(64, 16, DEFAULT_RECOMMENDATION_RULES);

    // Qwen3.6 27B Q4 (15.66 GB + 2 GB min context = 17.66 GB) doesn't fit in 16 GB VRAM (15 GB available)
    expect(matches.some((item) => item.name === M.QWEN3_6_27B && item.quantization === Q.Q4_K_M)).toBeFalse();

    // Qwen3.6 27B Q6 (23.18 GB + 2 GB = 25.18 GB) doesn't fit in 16 GB VRAM
    expect(matches.some((item) => item.name === M.QWEN3_6_27B && item.quantization === Q.Q6_K_XL)).toBeFalse();

    // Gemma 4 31B (17.83 GB + 2 GB = 19.83 GB) doesn't fit in 16 GB VRAM
    expect(matches.some((item) => item.name === M.GEMMA_4_31B)).toBeFalse();
  });

  it("shows only MoE models at 8 GB VRAM (dense models need 12 GB+)", () => {
    const matches = getMatchingRecommendations(16, 8, DEFAULT_RECOMMENDATION_RULES);

    // LFM2.5 8B A1B (MoE, 4.60 GB file, active 0.57 GB) is the only model at 16:8.
    // Dense models like Qwen3.5 9B (5.18 GB) and Gemma 4 12B (6.90 GB) are tiered to 12 GB VRAM
    // because they need file + 3 GB context overhead for practical usage.
    expect(matches.length).toBe(1);
    expect(matches[0].name).toBe(M.LFM2_5_8B_A1B);
  });

  it("shows MoE models via offload when VRAM is small but total memory suffices", () => {
    const matches = getMatchingRecommendations(64, 12, DEFAULT_RECOMMENDATION_RULES);

    // Gemma 4 26B A4B: 15.78 GB + 3 GB = 18.78 GB total needed
    // Available: 52 GB RAM + 11.25 GB VRAM = 63.25 GB ≥ 18.78 GB → fits via offload
    expect(matches.some((item) => item.name === M.GEMMA_4_26B_A4B)).toBeTrue();

    // Qwen3.6 35B A3B: 20.61 GB + 3 GB = 23.61 GB total needed
    // 63.25 GB ≥ 23.61 GB → fits via offload
    expect(matches.some((item) => item.name === M.QWEN3_6_35B_A3B)).toBeTrue();

    // Qwen3 Coder Next: 45.92 GB + 3 GB = 48.92 GB total needed
    // 63.25 GB ≥ 48.92 GB → fits via offload
    expect(matches.some((item) => item.name === M.QWEN3_CODER_NEXT)).toBeTrue();
  });

  it("filters out MoE models when total system memory is insufficient", () => {
    const matches = getMatchingRecommendations(32, 12, DEFAULT_RECOMMENDATION_RULES);

    // Qwen3 Coder Next: 45.92 GB + 3 GB = 48.92 GB total needed
    // 32 GB RAM (24 GB available) + 12 GB VRAM (11.25 GB available) = 35.25 GB total < 48.92 GB → filtered
    expect(matches.some((item) => item.name === M.QWEN3_CODER_NEXT)).toBeFalse();

    // Gemma 4 26B A4B: 15.78 GB + 3 GB = 18.78 GB total needed
    // 35.25 GB total ≥ 18.78 GB → still fits
    expect(matches.some((item) => item.name === M.GEMMA_4_26B_A4B)).toBeTrue();
  });

  it("filters MoE models when VRAM is too small for active params + context", () => {
    const matches = getMatchingRecommendations(64, 8, DEFAULT_RECOMMENDATION_RULES);

    // Qwen3 Coder Next: active 3B at Q4_K_M = 1.72 GB + 2 GB min context = 3.72 GB
    // 8 GB VRAM (7.5 GB available) ≥ 3.72 GB → VRAM check passes
    // Total: 45.92 + 3 = 48.92 GB, available: 52 + 7.5 = 59.5 GB → fits
    expect(matches.some((item) => item.name === M.QWEN3_CODER_NEXT)).toBeTrue();
  });

  it("contains generated hardware tiers for every currently defined model", () => {
    const availableEntries = new Set(
      DEFAULT_RECOMMENDATION_RULES.flatMap((rule) =>
        rule.models.map(
          (candidate) => `${candidate.name}|${candidate.quantization}`,
        ),
      ),
    );

    expect(availableEntries.size).toBe(
      EXPECTED_MODEL_QUANTIZATION_ENTRIES.length,
    );

    for (const expectedEntry of EXPECTED_MODEL_QUANTIZATION_ENTRIES) {
      expect(
        availableEntries.has(
          `${expectedEntry.name}|${expectedEntry.quantization}`,
        ),
      ).toBeTrue();
    }
  });

  it("returns the correct usage tag highlight state", () => {
    expect(getUsageHighlightState("coding", [])).toBe("default");
    expect(getUsageHighlightState("coding", ["coding", "vision"])).toBe(
      "highlighted",
    );
    expect(getUsageHighlightState("stem", ["coding", "vision"])).toBe("dimmed");
  });
});

describe("calculateFileSizeGb", () => {
  it("estimates file sizes within 8% of verified Hugging Face GGUF sizes", () => {
    const TOLERANCE = 0.08;

    for (const entry of ACTUAL_GGUF_SIZES_GB) {
      const estimated = calculateFileSizeGb(
        getModelParameterSize(entry.name),
        entry.quantization,
        entry.name,
      );
      const relativeError =
        Math.abs(estimated - entry.actualGb) / entry.actualGb;

      expect(relativeError).toBeLessThanOrEqual(TOLERANCE);
    }
  });

  it("applies K-quantization overhead and plain-quant baseline correctly", () => {
    // Q4_K_M: K-quant → 1.15x overhead. 8 params * 0.5 bytes * 1.15 = 4.6 GB
    expect(calculateFileSizeGb(8, Q.Q4_K_M)).toBeCloseTo(4.6, 1);

    // Q8_0: plain quant → 1.0x overhead. 4 params * 1.0 bytes * 1.0 = 4.0 GB
    expect(calculateFileSizeGb(4, Q.Q8_0)).toBeCloseTo(4.0, 1);

    // Q6_K_XL: K-quant → 1.15x overhead. 16 params * 0.75 bytes * 1.15 = 13.8 GB
    expect(calculateFileSizeGb(16, Q.Q6_K_XL)).toBeCloseTo(13.8, 1);
  });
});
