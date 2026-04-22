export const MODEL_NAMES = {
  QWEN3_4B_INSTRUCT_2507: "Qwen3 4B Instruct 2507",
  QWEN3_4B_THINKING_2507: "Qwen3 4B Thinking 2507",
  QWEN3_30B_INSTRUCT_2507: "Qwen3 30B Instruct 2507",
  QWEN3_30B_THINKING_2507: "Qwen3 30B Thinking 2507",
  QWEN3_CODER_30B_A3B_INSTRUCT: "Qwen3 Coder 30B A3B Instruct",
  QWEN3_CODER_NEXT: "Qwen3 Coder Next",
  QWEN3_5_9B: "Qwen3.5 9B",
  QWEN3_5_35B_A3B: "Qwen3.5 35B A3B",
  QWEN3_6_35B_A3B: "Qwen3.6 35B A3B",
  QWEN3_5_122B_A10B: "Qwen3.5 122B A10B",
  QWEN3_VL_4B_INSTRUCT: "Qwen3 VL 4B Instruct",
  QWEN3_VL_8B_INSTRUCT: "Qwen3 VL 8B Instruct",
  QWEN3_VL_32B_INSTRUCT: "Qwen3 VL 32B Instruct",
  QWEN3_VL_235B_INSTRUCT: "Qwen3 VL 235B Instruct",
  MISTRAL_SMALL_3_2: "Mistral Small 3.2",
  MISTRAL_SMALL_4: "Mistral Small 4",
  GPT_OSS_20B: "GPT OSS 20B",
  GPT_OSS_120B: "GPT OSS 120B",
  GEMMA_3_12B: "Gemma 3 12B",
  GEMMA_3_27B: "Gemma 3 27B",
  GLM_4_7_FLASH: "GLM 4.7 Flash",
  GEMMA_4_26B_A4B: "Gemma 4 26B A4B",
  GEMMA_4_31B: "Gemma 4 31B",
} as const;

export type ModelName = (typeof MODEL_NAMES)[keyof typeof MODEL_NAMES];

const MODEL_PARAMETER_OVERRIDES: Partial<Record<ModelName, number>> = {
  [MODEL_NAMES.QWEN3_CODER_NEXT]: 80,
  [MODEL_NAMES.GLM_4_7_FLASH]: 30,
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
  [MODEL_NAMES.QWEN3_4B_INSTRUCT_2507]: "unsloth/Qwen3-4B-Instruct-2507-GGUF",
  [MODEL_NAMES.QWEN3_4B_THINKING_2507]: "unsloth/Qwen3-4B-Thinking-2507-GGUF",
  [MODEL_NAMES.QWEN3_30B_INSTRUCT_2507]:
    "unsloth/Qwen3-30B-A3B-Instruct-2507-GGUF",
  [MODEL_NAMES.QWEN3_30B_THINKING_2507]:
    "unsloth/Qwen3-30B-A3B-Thinking-2507-GGUF",
  [MODEL_NAMES.QWEN3_CODER_30B_A3B_INSTRUCT]:
    "unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF",
  [MODEL_NAMES.QWEN3_CODER_NEXT]: "unsloth/Qwen3-Coder-Next-GGUF",
  [MODEL_NAMES.QWEN3_5_9B]: "unsloth/Qwen3.5-9B-GGUF",
  [MODEL_NAMES.QWEN3_5_35B_A3B]: "unsloth/Qwen3.5-35B-A3B-GGUF",
  [MODEL_NAMES.QWEN3_6_35B_A3B]: "unsloth/Qwen3.6-35B-A3B-GGUF",
  [MODEL_NAMES.QWEN3_5_122B_A10B]: "unsloth/Qwen3.5-122B-A10B-GGUF",
  [MODEL_NAMES.QWEN3_VL_4B_INSTRUCT]: "unsloth/Qwen3-VL-4B-Instruct-GGUF",
  [MODEL_NAMES.QWEN3_VL_8B_INSTRUCT]: "unsloth/Qwen3-VL-8B-Instruct-GGUF",
  [MODEL_NAMES.QWEN3_VL_32B_INSTRUCT]: "unsloth/Qwen3-VL-32B-Instruct-GGUF",
  [MODEL_NAMES.QWEN3_VL_235B_INSTRUCT]:
    "unsloth/Qwen3-VL-235B-A22B-Instruct-GGUF",
  [MODEL_NAMES.MISTRAL_SMALL_3_2]:
    "unsloth/Mistral-Small-3.2-24B-Instruct-2506-GGUF",
  [MODEL_NAMES.MISTRAL_SMALL_4]: "unsloth/Mistral-Small-4-119B-2603-GGUF",
  [MODEL_NAMES.GPT_OSS_20B]: "openai/gpt-oss-20b",
  [MODEL_NAMES.GPT_OSS_120B]: "openai/gpt-oss-120b",
  [MODEL_NAMES.GEMMA_3_12B]: "unsloth/gemma-3-12b-it-GGUF",
  [MODEL_NAMES.GEMMA_3_27B]: "unsloth/gemma-3-27b-it-GGUF",
  [MODEL_NAMES.GEMMA_4_26B_A4B]: "unsloth/gemma-4-26b-a4b-it-GGUF",
  [MODEL_NAMES.GEMMA_4_31B]: "unsloth/gemma-4-31b-it-GGUF",
  [MODEL_NAMES.GLM_4_7_FLASH]: "unsloth/GLM-4.7-Flash-GGUF",
};

export function getModelParameterSize(modelName: ModelName): number {
  const parameterSize =
    extractLargestParameterSize(modelName) ??
    extractLargestParameterSize(MODEL_TO_HF_MAPPING[modelName]) ??
    MODEL_PARAMETER_OVERRIDES[modelName];

  return parameterSize ?? 0;
}
