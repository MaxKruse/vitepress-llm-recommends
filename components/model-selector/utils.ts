import { MODEL_TO_HF_MAPPING } from "./constants/models";
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

  return baseSize + getVisionAdapterSize(modelName);
}

export function getUsefulnessColor(usefulness: number): string {
  if (usefulness >= 0.9) {
    return "var(--vp-c-green-2)";
  }

  if (usefulness >= 0.7) {
    return "var(--vp-c-yellow-2)";
  }

  if (usefulness >= 0.4) {
    return "var(--vp-c-orange-2)";
  }

  return "var(--vp-c-red-2)";
}

export function getUsefulnessLabel(usefulness: number): string {
  if (usefulness >= 0.9) {
    return "Excellent fit";
  }

  if (usefulness >= 0.7) {
    return "Strong fit";
  }

  if (usefulness >= 0.4) {
    return "Workable fit";
  }

  return "Fallback only";
}

function shouldReplaceExisting(
  current: ModelCandidate & { usefulness: number },
  next: ModelCandidate,
  usefulness: number,
): boolean {
  const currentQuantizationLevel = getQuantizationLevel(current.quantization);
  const nextQuantizationLevel = getQuantizationLevel(next.quantization);

  if (nextQuantizationLevel !== currentQuantizationLevel) {
    return nextQuantizationLevel > currentQuantizationLevel;
  }

  return usefulness > current.usefulness;
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

    for (const model of rule.models) {
      const existing = aggregated.get(model.name);

      if (!existing) {
        aggregated.set(model.name, { ...model, usefulness: rule.usefulness });
        continue;
      }

      const mergedUsage = existing.usage | model.usage;
      const bestUsefulness = Math.max(existing.usefulness, rule.usefulness);

      if (shouldReplaceExisting(existing, model, rule.usefulness)) {
        aggregated.set(model.name, {
          ...model,
          usage: mergedUsage,
          usefulness: bestUsefulness,
        });
        continue;
      }

      existing.usage = mergedUsage;
      existing.usefulness = bestUsefulness;
    }
  }

  return [...aggregated.values()].sort((left, right) => {
    if (right.usefulness !== left.usefulness) {
      return right.usefulness - left.usefulness;
    }

    if (right.parameters !== left.parameters) {
      return right.parameters - left.parameters;
    }

    return left.name.localeCompare(right.name);
  });
}
