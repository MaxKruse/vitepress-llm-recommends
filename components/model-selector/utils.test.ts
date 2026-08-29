import { describe, expect, it } from "bun:test";

import { MODEL_NAMES as M, MODEL_TO_HF_MAPPING, getModelParameterSize } from "./constants/models";
import type { ModelName } from "./constants/models";
import { MODEL_SIZE_ESTIMATES_GB } from "./constants/model-size-estimates";
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

// Actual GGUF file sizes sourced from Hugging Face via HEAD requests (August 2026).
// Includes the separate vision adapter (mmproj) where the model ships one.
// Tolerance is ±8 % to allow for minor upstream file changes without false failures.
const ACTUAL_GGUF_SIZES_GB: Array<{
  name: ModelName;
  quantization: string;
  actualGb: number;
}> = [
  { name: M.LFM2_5_8B_A1B, quantization: Q.Q4_K_M, actualGb: 4.96 },
  { name: M.GEMMA_4_12B, quantization: Q.Q4_K_M, actualGb: 6.79 },
  { name: M.GEMMA_4_26B_A4B, quantization: Q.Q4_K_M, actualGb: 16.89 },
  { name: M.MUSE_GLIMMER_30B, quantization: Q.Q4_K_XL, actualGb: 18.37 },
  { name: M.QWEN3_6_35B_A3B, quantization: Q.Q4_K_M, actualGb: 21.45 },
  { name: M.QWEN3_8_27B, quantization: Q.Q4_K_M, actualGb: 16.2 },
  { name: M.QWEN3_8_27B, quantization: Q.Q6_K_XL, actualGb: 24.43 },
  { name: M.QWEN3_8_FLASH_NEXT, quantization: Q.Q4_K_XL, actualGb: 104.54 },
];

const EXPECTED_MODEL_QUANTIZATION_ENTRIES = [
  { name: M.LFM2_5_8B_A1B, quantization: Q.Q4_K_M },
  { name: M.GEMMA_4_12B, quantization: Q.Q4_K_M },
  { name: M.GEMMA_4_26B_A4B, quantization: Q.Q4_K_M },
  { name: M.MUSE_GLIMMER_30B, quantization: Q.Q4_K_XL },
  { name: M.QWEN3_6_35B_A3B, quantization: Q.Q4_K_M },
  { name: M.QWEN3_8_27B, quantization: Q.Q4_K_M },
  { name: M.QWEN3_8_27B, quantization: Q.Q6_K_XL },
  { name: M.QWEN3_8_FLASH_NEXT, quantization: Q.Q4_K_XL },
] as const;

describe("getMatchingRecommendations", () => {
  it("derives parameter size from the model name and prefers the largest matching quantization for duplicate entries", () => {
    const rules: RecommendationRule[] = [
      {
        models: [
          {
            name: M.QWEN3_8_27B,
            quantization: Q.Q4_K_XL,
            usage: U.CODING,
          },
        ],
      },
      {
        models: [
          {
            name: M.QWEN3_8_27B,
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

  it("hides dense models that exceed VRAM even when combined RAM + VRAM suffices", () => {
    const matches = getMatchingRecommendations(
      64,
      16,
      DEFAULT_RECOMMENDATION_RULES,
    );

    // Qwen3.8 27B Q4_K_M: 16.20 GB file + 3 GB context = 19.20 GB.
    // It does not fit in 16 GB VRAM (15 GB available). Combined
    // 64 GB RAM (52 GB available) + 16 GB VRAM (15 GB available) = 67 GB
    // holds it physically, but a dense model with layers in RAM stalls
    // over PCIe on every token, so it is not recommended.
    expect(matches.some((item) => item.name === M.QWEN3_8_27B)).toBeFalse();

    // Muse Glimmer 30B Q4_K_XL: 18.37 + 3 = 21.37 GB > 15 GB VRAM - hidden.
    expect(matches.some((item) => item.name === M.MUSE_GLIMMER_30B)).toBeFalse();

    // Gemma 4 12B: 6.79 + 3 = 9.79 GB <= 15 GB - fully GPU-resident, shown.
    expect(matches.some((item) => item.name === M.GEMMA_4_12B)).toBeTrue();

    // Qwen3.6 35B A3B (MoE) fits the same rig: only 3B are active per
    // token, so idle experts can sit in system RAM.
    expect(matches.some((item) => item.name === M.QWEN3_6_35B_A3B)).toBeTrue();
  });

  it("shows dense models when weights and context fit entirely in VRAM", () => {
    const atTwentyFour = getMatchingRecommendations(
      64,
      24,
      DEFAULT_RECOMMENDATION_RULES,
    );

    // Qwen3.8 27B Q4_K_M: 19.20 GB <= 23 GB available on a 24 GB card.
    // Q6_K_XL (27.43 GB) still exceeds 23 GB, so the Q4 candidate is the
    // one surfaced.
    const qwenAtTwentyFour = atTwentyFour.find(
      (item) => item.name === M.QWEN3_8_27B,
    );
    expect(qwenAtTwentyFour?.quantization).toBe(Q.Q4_K_M);

    const atThirtyTwo = getMatchingRecommendations(
      64,
      32,
      DEFAULT_RECOMMENDATION_RULES,
    );

    // 32 GB card (31 GB available): Q6_K_XL (27.43 GB) now fits too, so
    // the aggregated entry prefers the higher quantization.
    const qwenAtThirtyTwo = atThirtyTwo.find(
      (item) => item.name === M.QWEN3_8_27B,
    );
    expect(qwenAtThirtyTwo?.quantization).toBe(Q.Q6_K_XL);
  });

  it("shows only the MoE pick at 16 GB RAM + 8 GB VRAM", () => {
    const matches = getMatchingRecommendations(
      16,
      8,
      DEFAULT_RECOMMENDATION_RULES,
    );

    // LFM2.5 8B A1B (MoE, 4.96 GB, 1B active) runs fast with idle experts
    // in system RAM. Gemma 4 12B (dense, 9.79 GB) does not fit in 8 GB
    // VRAM (7.5 GB available); even though 17.5 GB combined memory holds
    // it, a dense model is not recommended partially offloaded.
    expect(matches.length).toBe(1);
    expect(matches[0]?.name).toBe(M.LFM2_5_8B_A1B);
  });

  it("shows MoE models via offload when VRAM is small but total memory suffices", () => {
    const matches = getMatchingRecommendations(
      64,
      12,
      DEFAULT_RECOMMENDATION_RULES,
    );

    // Gemma 4 26B A4B: 16.89 GB + 3 GB = 19.89 GB total needed
    // Available: 52 GB RAM + 11.25 GB VRAM = 63.25 GB ≥ 19.89 GB → fits via offload
    expect(matches.some((item) => item.name === M.GEMMA_4_26B_A4B)).toBeTrue();

    // Qwen3.6 35B A3B: 21.45 GB + 3 GB = 24.45 GB total needed
    // 63.25 GB ≥ 24.45 GB → fits via offload
    expect(matches.some((item) => item.name === M.QWEN3_6_35B_A3B)).toBeTrue();

    // Qwen3.8-Flash-Next is reserved for 128 GB RAM + 32 GB VRAM hardware.
    expect(matches.some((item) => item.name === M.QWEN3_8_FLASH_NEXT)).toBeFalse();
  });

  it("filters out models when total system memory is insufficient", () => {
    const matches = getMatchingRecommendations(
      32,
      12,
      DEFAULT_RECOMMENDATION_RULES,
    );

    // Qwen3.8-Flash-Next: 104.55 GB + 3 GB = 107.55 GB total needed
    // 32 GB RAM (24 GB available) + 12 GB VRAM (11.25 GB available) = 35.25 GB < 107.55 GB → filtered
    // (its 128 GB RAM tier floor also excludes this hardware)
    expect(matches.some((item) => item.name === M.QWEN3_8_FLASH_NEXT)).toBeFalse();

    // Gemma 4 26B A4B: 16.89 GB + 3 GB = 19.89 GB total needed
    // 35.25 GB total ≥ 19.89 GB → still fits
    expect(matches.some((item) => item.name === M.GEMMA_4_26B_A4B)).toBeTrue();
  });

  it("recommends dense models on big-VRAM rigs even with small system RAM", () => {
    // 16 GB RAM (10 GB usable) + 24 GB VRAM (23 GB usable).
    // Every dense pick fits entirely in VRAM:
    // - Gemma 4 12B: 6.79 + 3 = 9.79 GB
    // - Qwen3.8 27B Q4_K_M: 16.20 + 3 = 19.20 GB
    // - Muse Glimmer 30B Q4_K_XL: 18.37 + 3 = 21.37 GB
    // 27B Q6_K_XL (27.43 GB) exceeds 23 GB, so 27B surfaces as Q4_K_M.
    const atSixteenByTwentyFour = getMatchingRecommendations(
      16,
      24,
      DEFAULT_RECOMMENDATION_RULES,
    );

    const namesAtSixteenByTwentyFour = new Set(
      atSixteenByTwentyFour.map((item) => item.name),
    );

    expect(atSixteenByTwentyFour).toHaveLength(6);
    expect(namesAtSixteenByTwentyFour.has(M.QWEN3_8_27B)).toBeTrue();
    expect(namesAtSixteenByTwentyFour.has(M.MUSE_GLIMMER_30B)).toBeTrue();
    expect(namesAtSixteenByTwentyFour.has(M.GEMMA_4_26B_A4B)).toBeTrue();
    expect(namesAtSixteenByTwentyFour.has(M.QWEN3_6_35B_A3B)).toBeTrue();
    expect(namesAtSixteenByTwentyFour.has(M.GEMMA_4_12B)).toBeTrue();
    expect(namesAtSixteenByTwentyFour.has(M.LFM2_5_8B_A1B)).toBeTrue();
    expect(namesAtSixteenByTwentyFour.has(M.QWEN3_8_FLASH_NEXT)).toBeFalse();
    expect(
      atSixteenByTwentyFour.find(
        (item) => item.name === M.QWEN3_8_27B,
      )?.quantization,
    ).toBe(Q.Q4_K_M);

    // 16 GB RAM + 32 GB VRAM (31 GB usable): Q6_K_XL (27.43 GB) fits in
    // VRAM, so 27B surfaces at the higher quantization.
    const atSixteenByThirtyTwo = getMatchingRecommendations(
      16,
      32,
      DEFAULT_RECOMMENDATION_RULES,
    );

    expect(atSixteenByThirtyTwo).toHaveLength(6);
    expect(
      atSixteenByThirtyTwo.find(
        (item) => item.name === M.QWEN3_8_27B,
      )?.quantization,
    ).toBe(Q.Q6_K_XL);
  });

  it("keeps Flash-Next below its mandatory 128 GB RAM + 32 GB VRAM floor", () => {
    // 128 GB RAM (116 GB usable) + 8 GB VRAM (7.5 GB usable) = 123.5 GB usable,
    // which physically holds the 107.55 GB total. The mandatory floor still
    // excludes this rig: below 32 GB VRAM the model is not usable in practice.
    const matches = getMatchingRecommendations(
      128,
      8,
      DEFAULT_RECOMMENDATION_RULES,
    );

    expect(
      matches.some((item) => item.name === M.QWEN3_8_FLASH_NEXT),
    ).toBeFalse();
  });

  it("passes MoE models whose active parameters fit in VRAM for offload", () => {
    const matches = getMatchingRecommendations(
      64,
      8,
      DEFAULT_RECOMMENDATION_RULES,
    );

    // Qwen3.6 35B A3B: active 3B at Q4_K_M = 1.73 GB + 3 GB context = 4.73 GB
    // 8 GB VRAM (7.5 GB available) ≥ 4.73 GB → VRAM check passes
    // Total: 21.45 + 3 = 24.45 GB, available: 52 + 7.5 = 59.5 GB → fits
    expect(matches.some((item) => item.name === M.QWEN3_6_35B_A3B)).toBeTrue();
  });

  it("contains a recommendation for every currently defined model and quantization", () => {
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

describe("catalog consistency", () => {
  it("measures a size for every recommended model and quantization", () => {
    const sizeKeys = new Set(
      MODEL_SIZE_ESTIMATES_GB.map(
        (entry) => `${entry.name}|${entry.quantization}`,
      ),
    );

    for (const rule of DEFAULT_RECOMMENDATION_RULES) {
      for (const candidate of rule.models) {
        expect(
          sizeKeys.has(`${candidate.name}|${candidate.quantization}`),
          `${candidate.name} ${candidate.quantization} is missing from MODEL_SIZE_ESTIMATES_GB`,
        ).toBeTrue();
      }
    }
  });

  it("does not measure sizes for models that are not recommended", () => {
    const ruleKeys = new Set(
      DEFAULT_RECOMMENDATION_RULES.flatMap((rule) =>
        rule.models.map(
          (candidate) => `${candidate.name}|${candidate.quantization}`,
        ),
      ),
    );

    for (const entry of MODEL_SIZE_ESTIMATES_GB) {
      expect(
        ruleKeys.has(`${entry.name}|${entry.quantization}`),
        `${entry.name} ${entry.quantization} has a size entry but no recommendation profile`,
      ).toBeTrue();
    }
  });

  it("maps every recommended model to a Hugging Face repo", () => {
    const recommendedNames = new Set(
      DEFAULT_RECOMMENDATION_RULES.flatMap((rule) =>
        rule.models.map((candidate) => candidate.name),
      ),
    );

    for (const name of recommendedNames) {
      expect(
        MODEL_TO_HF_MAPPING[name],
        `${name} is missing from MODEL_TO_HF_MAPPING`,
      ).toBeDefined();
    }
  });
});
