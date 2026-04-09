import type { ModelName } from "./constants/models";
import type { Quantization } from "./constants/quantizations";
import type { RecommendedUsageMask } from "./constants/usage";

export interface ModelCandidate {
  name: ModelName;
  parameters?: number;
  quantization: Quantization;
  usage: RecommendedUsageMask;
}

export interface RecommendationRule {
  ramMin: number;
  vramMin: number;
  models: ModelCandidate[];
}

export interface AggregatedRecommendation extends Omit<
  ModelCandidate,
  "parameters"
> {
  parameters: number;
}
