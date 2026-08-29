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

// KV cache + runtime headroom for the documented 32K context assumption
// (no KV-cache quantization), applied on top of the model file size.
const CONTEXT_OVERHEAD_GB = 3;

// Display priority for model sorting (lower number = higher rank).
const MODEL_DISPLAY_PRIORITY: Record<string, number> = {
  "Qwen3.8 27B": 0,
  "Qwen3.8-Flash-Next": 1,
  "Qwen3.6 35B A3B": 2,
  "Muse Glimmer 30B": 3,
  "Gemma 4 26B A4B": 4,
  "Gemma 4 12B": 5,
  "LFM2.5 8B A1B": 6,
};

function getSystemVramOverheadGb(totalVramGb: number): number {
  // Smaller GPUs reserve less for the desktop environment.
  if (totalVramGb <= 8) return 0.5;
  if (totalVramGb <= 12) return 0.75;
  return 1;
}

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

  return baseSize * overhead;
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

function isMoEModel(modelName: string): boolean {
  return /\bA\d+B\b/i.test(modelName) || modelName === "Qwen3.8-Flash-Next";
}

function getMoeActiveParamsB(modelName: string): number | null {
  const match = modelName.match(/\bA(\d+(?:\.\d+)?)B\b/i);
  if (match?.[1]) return Number.parseFloat(match[1]);

  if (modelName === "Qwen3.8-Flash-Next") return 6;
  return null;
}

function getActiveParameterGb(model: AggregatedRecommendation): number {
  const activeB = getMoeActiveParamsB(model.name);

  // Unknown active parameter count: be conservative and require the whole
  // file to sit in VRAM, like a dense model.
  if (activeB === null) {
    return calculateFileSizeGb(model.parameters, model.quantization, model.name);
  }

  return (
    activeB *
    (getQuantizationLevel(model.quantization) / 8) *
    getQuantizationOverhead(model.quantization)
  );
}

function canFitWithinHardware(
  model: AggregatedRecommendation,
  totalRamGb: number,
  totalVramGb: number,
): boolean {
  const fileSizeGb = calculateFileSizeGb(
    model.parameters,
    model.quantization,
    model.name,
  );
  const totalGb = fileSizeGb + CONTEXT_OVERHEAD_GB;
  const availableVramGb = Math.max(0, totalVramGb - getSystemVramOverheadGb(totalVramGb));
  const availableRamGb = Math.max(0, totalRamGb - getSystemRamOverheadGb(totalRamGb));

  if (isMoEModel(model.name)) {
    // MoE: the entire file loads into RAM + VRAM combined, but only the
    // active experts are touched per token. Two things must hold:
    // 1. Full file + context fits in RAM + VRAM combined.
    // 2. Active parameters + context fit in VRAM, so the GPU handles the
    //    hot path while idle experts sit in system RAM (llama.cpp
    //    `--fit on`). Speed then tracks the small active size, not the
    //    total model size.
    if (availableRamGb + availableVramGb < totalGb) {
      return false;
    }

    return availableVramGb >= getActiveParameterGb(model) + CONTEXT_OVERHEAD_GB;
  }

  // Dense: every parameter is active for every token, so each layer left
  // in system RAM stalls token generation over PCIe. Benchmarks show a
  // steep cliff: any CPU-resident layer drops throughput to a fraction of
  // full-GPU speed, so a dense model is only recommended when weights +
  // context fit entirely in VRAM.
  return availableVramGb >= totalGb;
}

export function getMatchingRecommendations(
  ram: number,
  vram: number,
  rules: RecommendationRule[],
): AggregatedRecommendation[] {
  const aggregated = new Map<string, AggregatedRecommendation>();

  for (const rule of rules) {
    for (const candidate of rule.models) {
      const model = resolveModelCandidate(candidate);

      if (
        (model.ramMin !== undefined && ram < model.ramMin) ||
        (model.vramMin !== undefined && vram < model.vramMin)
      ) {
        continue;
      }

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
    const leftPriority = MODEL_DISPLAY_PRIORITY[left.name];
    const rightPriority = MODEL_DISPLAY_PRIORITY[right.name];

    // Custom priority order (lower number = higher rank)
    if (leftPriority !== undefined && rightPriority !== undefined) {
      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }
    } else if (leftPriority !== undefined) {
      return -1;
    } else if (rightPriority !== undefined) {
      return 1;
    }

    // Within same model: prefer higher quantization
    const rightQuantizationLevel = getQuantizationLevel(right.quantization);
    const leftQuantizationLevel = getQuantizationLevel(left.quantization);

    if (rightQuantizationLevel !== leftQuantizationLevel) {
      return rightQuantizationLevel - leftQuantizationLevel;
    }

    return left.name.localeCompare(right.name);
  });
}
