import { describe, expect, it } from "bun:test";

import { MODEL_NAMES as M } from "./constants/models";
import { QUANTIZATIONS as Q } from "./constants/quantizations";
import { RECOMMENDED_USAGE as U } from "./constants/usage";
import { DEFAULT_RECOMMENDATION_RULES } from "./recommendations";
import type { RecommendationRule } from "./types";
import {
  getLmStudioUri,
  getMatchingRecommendations,
  getUsageHighlightState,
} from "./utils";

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

    for (const modelName of recommendedModelNames) {
      expect(getLmStudioUri(modelName)).not.toBeNull();
    }
  });

  it("returns the correct usage tag highlight state", () => {
    expect(getUsageHighlightState("coding", [])).toBe("default");
    expect(getUsageHighlightState("coding", ["coding", "vision"])).toBe(
      "highlighted",
    );
    expect(getUsageHighlightState("stem", ["coding", "vision"])).toBe(
      "dimmed",
    );
  });
});
