import { MODEL_TO_HF_MAPPING, getModelParameterSize } from "./constants/models";
import { MODEL_SIZE_ESTIMATES_GB } from "./constants/model-size-estimates";
import type { UsageKey } from "./constants/usage";
import type {
  AggregatedRecommendation,
  ModelCandidate,
  RecommendationRule,
} from "./types";

const modelSizeEstimateByKey = new Map(
  MODEL_SIZE_ESTIMATES_GB.map((entry) => [
    `${entry.name}|${entry.quantization}`,
    entry.sizeGb,
  ]),
);

const SYSTEM_VRAM_OVERHEAD_GB = 1;

function getSystemRamOverheadGb(totalRamGb: number): number {
  if (totalRamGb <= 16) {
    return 6;
  }

  if (totalRamGb <= 32) {
    return 8;
  }

  return 12;
}

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
  // All vision-capable models ship a separate mmproj adapter file that must be
  // loaded alongside the base GGUF. Adapters range from ~800 MB to ~1.9 GB;
  // we use the upper bound to avoid under-estimating VRAM requirements.
  if (hasVisionAdapter(modelName)) {
    return 1.9;
  }

  return 0;
}

function getQuantizationOverhead(quantization: string): number {
  // K-quantizations use mixed precision (some layers higher than nominal),
  // adding ~15 % overhead over pure weight bytes.
  // Standard integer quants (Q8_0, Q4_0, etc.) are close to 1:1.
  return /K_/i.test(quantization) ? 1.15 : 1.0;
}

function getMeasuredModelSizeGb(
  modelName: string,
  quantization: string,
): number | null {
  const measured = modelSizeEstimateByKey.get(`${modelName}|${quantization}`);

  return measured ?? null;
}

export function calculateFileSizeGb(
  paramsB: number,
  quantization: string,
  modelName = "",
): number {
  if (modelName) {
    const measuredSize = getMeasuredModelSizeGb(modelName, quantization);

    if (measuredSize !== null) {
      return measuredSize;
    }
  }

  const quantLevel = getQuantizationLevel(quantization);
  const baseSize = paramsB * (quantLevel / 8);
  const overhead = getQuantizationOverhead(quantization);

  return baseSize * overhead + getVisionAdapterSize(modelName);
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

function parseMoeActiveParameters(modelName: string): number | null {
  const match = modelName.match(/\bA(\d+(?:\.\d+)?)B\b/i);
  const active = match?.[1];

  if (!active) {
    return null;
  }

  return Number.parseFloat(active);
}

function getRequiredMemorySplitGb(
  model: AggregatedRecommendation,
): { ramGb: number; vramGb: number } {
  const fileSizeGb = calculateFileSizeGb(
    model.parameters,
    model.quantization,
    model.name,
  );
  const moeActiveB = parseMoeActiveParameters(model.name);

  if (moeActiveB !== null && model.parameters > 0) {
    const activeRatio = Math.min(Math.max(moeActiveB / model.parameters, 0), 1);
    const vramForWeightsGb = Math.max(2, fileSizeGb * activeRatio);
    const ramForWeightsGb = Math.max(0, fileSizeGb - vramForWeightsGb);

    return {
      ramGb: ramForWeightsGb,
      vramGb: vramForWeightsGb,
    };
  }

  return {
    ramGb: 0,
    vramGb: fileSizeGb,
  };
}

function canFitWithinHardware(
  model: AggregatedRecommendation,
  totalRamGb: number,
  totalVramGb: number,
): boolean {
  const availableRamGb = Math.max(0, totalRamGb - getSystemRamOverheadGb(totalRamGb));
  const availableVramGb = Math.max(0, totalVramGb - SYSTEM_VRAM_OVERHEAD_GB);
  const required = getRequiredMemorySplitGb(model);

  return availableRamGb >= required.ramGb && availableVramGb >= required.vramGb;
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

      if (!canFitWithinHardware(model, ram, vram)) {
        continue;
      }

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
