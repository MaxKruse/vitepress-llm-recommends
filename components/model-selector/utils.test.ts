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
// Vision models are excluded here because calculateFileSizeGb intentionally adds
// a 1.9 GB adapter overhead on top of the base GGUF — testing them against the
// raw GGUF size alone would produce a false failure.
// Tolerance is ±8 % to allow for minor upstream file changes without false failures.
const ACTUAL_GGUF_SIZES_GB: Array<{
  name: ModelName;
  quantization: string;
  actualGb: number;
}> = [
  { name: M.QWEN3_CODER_NEXT, quantization: Q.Q4_K_M, actualGb: 45.2 },
  { name: M.GLM_4_7_FLASH, quantization: Q.Q4_K_M, actualGb: 17.05 },
  { name: M.GEMMA_4_26B_A4B, quantization: Q.Q4_K_M, actualGb: 15.78 },
  { name: M.QWEN3_6_35B_A3B, quantization: Q.Q4_K_M, actualGb: 20.61 },
  { name: M.QWEN3_6_27B, quantization: Q.Q4_K_M, actualGb: 15.66 },
  { name: M.QWEN3_4B_INSTRUCT_2507, quantization: Q.Q8_0, actualGb: 3.99 },
];

// Vision models: actual GGUF size + 1.9 GB assumed adapter overhead.
const ACTUAL_VISION_SIZES_GB: Array<{
  name: ModelName;
  quantization: string;
  actualGb: number;
}> = [
  { name: M.QWEN3_VL_32B_INSTRUCT, quantization: Q.Q6_K_XL, actualGb: 26.97 + 1.9 },
  { name: M.QWEN3_VL_8B_INSTRUCT, quantization: Q.Q4_K_M, actualGb: 4.68 + 1.9 },
  { name: M.QWEN3_VL_4B_INSTRUCT, quantization: Q.Q4_K_M, actualGb: 2.33 + 1.9 },
];

const EXPECTED_MODEL_QUANTIZATION_ENTRIES = [
  { name: M.QWEN3_CODER_NEXT, quantization: Q.Q4_K_M },
  { name: M.GLM_4_7_FLASH, quantization: Q.Q4_K_M },
  { name: M.GEMMA_4_26B_A4B, quantization: Q.Q4_K_M },
  { name: M.QWEN3_6_35B_A3B, quantization: Q.Q4_K_M },
  { name: M.QWEN3_6_27B, quantization: Q.Q4_K_M },
  { name: M.QWEN3_5_122B_A10B, quantization: Q.Q4_K_M },
  { name: M.GPT_OSS_20B, quantization: Q.MXFP4 },
  { name: M.MISTRAL_SMALL_4, quantization: Q.Q4_K_M },
  { name: M.QWEN3_VL_32B_INSTRUCT, quantization: Q.Q6_K_XL },
  { name: M.QWEN3_VL_8B_INSTRUCT, quantization: Q.Q4_K_M },
  { name: M.QWEN3_VL_4B_INSTRUCT, quantization: Q.Q4_K_M },
  { name: M.QWEN3_4B_INSTRUCT_2507, quantization: Q.Q8_0 },
] as const;

describe("getMatchingRecommendations", () => {
  it("derives parameter size from the model name and prefers the largest matching quantization for duplicate entries", () => {
    const rules: RecommendationRule[] = [
      {
        ramMin: 32,
        vramMin: 0,
        models: [
          {
            name: M.GLM_4_7_FLASH,
            quantization: Q.Q4_K_XL,
            usage: U.CODING,
          },
        ],
      },
      {
        ramMin: 64,
        vramMin: 0,
        models: [
          {
            name: M.GLM_4_7_FLASH,
            quantization: Q.Q8_K_XL,
            usage: U.INSTRUCT,
          },
        ],
      },
    ];

    const [recommendation] = getMatchingRecommendations(64, 0, rules);

    expect(recommendation?.parameters).toBe(30);
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

  it("assigns MoE models to RAM-heavy tiers and dense models to VRAM-heavy tiers", () => {
    const denseRule = DEFAULT_RECOMMENDATION_RULES.find((rule) =>
      rule.models.some(
        (candidate) =>
          candidate.name === M.QWEN3_6_27B &&
          candidate.quantization === Q.Q4_K_M,
      ),
    );
    const moeRule = DEFAULT_RECOMMENDATION_RULES.find((rule) =>
      rule.models.some(
        (candidate) =>
          candidate.name === M.QWEN3_6_35B_A3B &&
          candidate.quantization === Q.Q4_K_M,
      ),
    );

    expect(denseRule).toBeDefined();
    expect(moeRule).toBeDefined();

    expect(moeRule!.ramMin).toBeGreaterThanOrEqual(denseRule!.ramMin);
    expect(moeRule!.vramMin).toBeLessThan(denseRule!.vramMin);
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
  it("estimates non-vision file sizes within 8% of verified Hugging Face GGUF sizes", () => {
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

  it("adds 1.9 GB adapter overhead for all vision models including Qwen3 VL", () => {
    const TOLERANCE = 0.08;

    for (const entry of ACTUAL_VISION_SIZES_GB) {
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
});
