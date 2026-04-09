export const MODEL_NAMES = {
  QWEN3_4B_INSTRUCT_2507: "Qwen3 4B Instruct 2507",
  QWEN3_4B_THINKING_2507: "Qwen3 4B Thinking 2507",
  QWEN3_30B_INSTRUCT_2507: "Qwen3 30B Instruct 2507",
  QWEN3_30B_THINKING_2507: "Qwen3 30B Thinking 2507",
  QWEN3_CODER_30B_A3B_INSTRUCT: "Qwen3 Coder 30B A3B Instruct",
  QWEN3_CODER_NEXT: "Qwen3 Coder Next",
  QWEN3_35B_A3B: "Qwen3 35B A3B",
  QWEN3_5_9B: "Qwen3.5 9B",
  QWEN3_5_35B_A3B: "Qwen3.5 35B A3B",
  QWEN3_5_122B_A10B: "Qwen3.5 122B A10B",
  QWEN3_VL_8B_INSTRUCT: "Qwen3 VL 8B Instruct",
  QWEN3_VL_32B_INSTRUCT: "Qwen3 VL 32B Instruct",
  QWEN3_VL_235B_INSTRUCT: "Qwen3 VL 235B Instruct",
  MISTRAL_SMALL_3_2: "Mistral Small 3.2",
  GPT_OSS_20B: "GPT OSS 20B",
  GPT_OSS_120B: "GPT OSS 120B",
  GEMMA_3_12B: "Gemma 3 12B",
  GEMMA_3_27B: "Gemma 3 27B",
  GLM_4_7_FLASH: "GLM 4.7 Flash",
} as const;

export type ModelName = (typeof MODEL_NAMES)[keyof typeof MODEL_NAMES];

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
  [MODEL_NAMES.MISTRAL_SMALL_3_2]:
    "unsloth/Mistral-Small-3.2-24B-Instruct-2506-GGUF",
  [MODEL_NAMES.GPT_OSS_20B]: "openai/gpt-oss-20b",
  [MODEL_NAMES.GPT_OSS_120B]: "openai/gpt-oss-120b",
  [MODEL_NAMES.GEMMA_3_12B]: "unsloth/gemma-3-12b-it-GGUF",
  [MODEL_NAMES.GEMMA_3_27B]: "unsloth/gemma-3-27b-it-GGUF",
  [MODEL_NAMES.GLM_4_7_FLASH]: "unsloth/GLM-4.7-Flash-GGUF",
};
