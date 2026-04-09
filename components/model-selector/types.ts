import type { ModelName } from "./constants/models";
import type { Quantization } from "./constants/quantizations";
import type { RecommendedUsageMask } from "./constants/usage";

export interface ModelCandidate {
  name: ModelName;
  parameters: number;
  quantization: Quantization;
  usage: RecommendedUsageMask;
}

export interface RecommendationRule {
  ramMin: number;
  vramMin: number;
  usefulness: number;
  models: ModelCandidate[];
}

export interface AggregatedRecommendation extends ModelCandidate {
  usefulness: number;
}
