import type { ModelName } from "./constants/models";
import type { Quantization } from "./constants/quantizations";
import type { RecommendedUsageMask } from "./constants/usage";

export interface ModelCandidate {
  name: ModelName;
  parameters?: number;
  quantization: Quantization;
  usage: RecommendedUsageMask;
  /**
   * Mandatory minimum RAM (GB) for this model, independent of whether it
   * physically fits. Only set where usability demands more than the file
   * size (e.g. Flash-Next).
   */
  ramMin?: number;
  /** Mandatory minimum VRAM (GB) for this model. */
  vramMin?: number;
}

export interface RecommendationRule {
  models: ModelCandidate[];
}

export interface AggregatedRecommendation extends Omit<
  ModelCandidate,
  "parameters"
> {
  parameters: number;
}
