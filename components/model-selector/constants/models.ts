export const MODEL_NAMES = {
  LFM2_5_8B_A1B: "LFM2.5 8B A1B",
  GEMMA_4_12B: "Gemma 4 12B",
  GEMMA_4_26B_A4B: "Gemma 4 26B A4B",
  MUSE_GLIMMER_30B: "Muse Glimmer 30B",
  QWEN3_6_35B_A3B: "Qwen3.6 35B A3B",
  QWEN3_8_27B: "Qwen3.8 27B",
  QWEN3_8_FLASH_NEXT: "Qwen3.8-Flash-Next",
} as const;

export type ModelName = (typeof MODEL_NAMES)[keyof typeof MODEL_NAMES];

const MODEL_PARAMETER_OVERRIDES: Partial<Record<ModelName, number>> = {
  // No parameter count is encoded in the name. 180B total: 125B main MoE +
  // 51B Engram n-gram table + 4B MTP head (6B active per token).
  [MODEL_NAMES.QWEN3_8_FLASH_NEXT]: 180,
};

function extractLargestParameterSize(value?: string): number | null {
  if (!value) {
    return null;
  }

  const matches = [...value.matchAll(/(\d+(?:\.\d+)?)B\b/gi)].flatMap(
    (match) => {
      const size = match[1];
      return size ? [Number.parseFloat(size)] : [];
    },
  );

  if (!matches.length) {
    return null;
  }

  return Math.max(...matches);
}

export const MODEL_TO_HF_MAPPING: Partial<Record<ModelName, string>> = {
  [MODEL_NAMES.LFM2_5_8B_A1B]: "unsloth/LFM2.5-8B-A1B-GGUF",
  [MODEL_NAMES.GEMMA_4_12B]: "unsloth/gemma-4-12b-it-GGUF",
  [MODEL_NAMES.GEMMA_4_26B_A4B]: "unsloth/gemma-4-26B-A4B-it-GGUF",
  [MODEL_NAMES.MUSE_GLIMMER_30B]: "unsloth/Muse-Glimmer-30B-GGUF",
  [MODEL_NAMES.QWEN3_6_35B_A3B]: "unsloth/Qwen3.6-35B-A3B-GGUF",
  [MODEL_NAMES.QWEN3_8_27B]: "unsloth/Qwen3.8-27B-GGUF",
  [MODEL_NAMES.QWEN3_8_FLASH_NEXT]: "unsloth/Qwen3.8-Flash-Next-GGUF",
};

export function getModelParameterSize(modelName: ModelName): number {
  const parameterSize =
    extractLargestParameterSize(modelName) ??
    extractLargestParameterSize(MODEL_TO_HF_MAPPING[modelName]) ??
    MODEL_PARAMETER_OVERRIDES[modelName];

  return parameterSize ?? 0;
}
