import { MODEL_TO_HF_MAPPING, getModelParameterSize } from "./constants/models";
import type { UsageKey } from "./constants/usage";
import type {
  AggregatedRecommendation,
  ModelCandidate,
  RecommendationRule,
} from "./types";

export function getLmStudioUri(modelName: string): string | null {
  const hfPath =
    MODEL_TO_HF_MAPPING[modelName as keyof typeof MODEL_TO_HF_MAPPING];

  if (!hfPath) {
    return null;
  }

  return `lmstudio://open_from_hf?model=${hfPath}`;
}

export type UsageHighlightState = "default" | "highlighted" | "dimmed";

export function getUsageHighlightState(
  usageKey: UsageKey,
  activeUsageKeys: readonly UsageKey[],
): UsageHighlightState {
  if (!activeUsageKeys.length) {
    return "default";
  }

  return activeUsageKeys.includes(usageKey) ? "highlighted" : "dimmed";
}

export function getQuantizationLevel(quantization: string): number {
  if (quantization.includes("BF16") || quantization.includes("F16")) {
    return 16;
  }

  const qMatch = quantization.match(/Q(\d+(?:\.\d+)?)/i);
  const qValue = qMatch?.[1];
  if (qValue) {
    return parseFloat(qValue);
  }

  const fpMatch = quantization.match(/FP(\d+(?:\.\d+)?)/i);
  const fpValue = fpMatch?.[1];
  if (fpValue) {
    return parseFloat(fpValue);
  }

  return 0;
}

export function hasVisionAdapter(modelName: string): boolean {
  return /mistral\s*small|gemma\s*3|qwen3\s*vl/i.test(modelName);
}

function getVisionAdapterSize(modelName: string): number {
  if (/qwen3\s*vl/i.test(modelName)) {
    return 1.3;
  }

  if (/mistral\s*small|gemma\s*3/i.test(modelName)) {
    return 0.9;
  }

  return 0;
}

export function calculateFileSizeGb(
  paramsB: number,
  quantization: string,
  modelName = "",
): number {
  const quantLevel = getQuantizationLevel(quantization);
  const baseSize = paramsB * (quantLevel / 8);

  return baseSize * 1.4 + getVisionAdapterSize(modelName);
}

function resolveModelCandidate(
  model: ModelCandidate,
): AggregatedRecommendation {
  return {
    ...model,
    parameters: model.parameters ?? getModelParameterSize(model.name),
  };
}

function shouldReplaceExisting(
  current: AggregatedRecommendation,
  next: AggregatedRecommendation,
): boolean {
  const currentQuantizationLevel = getQuantizationLevel(current.quantization);
  const nextQuantizationLevel = getQuantizationLevel(next.quantization);

  if (nextQuantizationLevel !== currentQuantizationLevel) {
    return nextQuantizationLevel > currentQuantizationLevel;
  }

  return next.parameters > current.parameters;
}

export function getMatchingRecommendations(
  ram: number,
  vram: number,
  rules: RecommendationRule[],
): AggregatedRecommendation[] {
  const aggregated = new Map<string, AggregatedRecommendation>();

  for (const rule of rules) {
    if (ram < rule.ramMin || vram < rule.vramMin) {
      continue;
    }

    for (const candidate of rule.models) {
      const model = resolveModelCandidate(candidate);
      const existing = aggregated.get(model.name);

      if (!existing) {
        aggregated.set(model.name, model);
        continue;
      }

      const mergedUsage = existing.usage | model.usage;

      if (shouldReplaceExisting(existing, model)) {
        aggregated.set(model.name, {
          ...model,
          usage: mergedUsage,
        });
        continue;
      }

      existing.usage = mergedUsage;
    }
  }

  return [...aggregated.values()].sort((left, right) => {
    if (right.parameters !== left.parameters) {
      return right.parameters - left.parameters;
    }

    const rightQuantizationLevel = getQuantizationLevel(right.quantization);
    const leftQuantizationLevel = getQuantizationLevel(left.quantization);

    if (rightQuantizationLevel !== leftQuantizationLevel) {
      return rightQuantizationLevel - leftQuantizationLevel;
    }

    return left.name.localeCompare(right.name);
  });
}
