export const QUANTIZATIONS = {
  BF16: "BF16",
  F16: "F16",
  MXFP4: "MXFP4",
  Q8_0: "Q8_0",
  Q8_K_XL: "Q8_K_XL",
  Q6_K_XL: "Q6_K_XL",
  Q4_K_XL: "Q4_K_XL",
  Q4_K_M: "Q4_K_M",
  Q3_K_XL: "Q3_K_XL",
} as const;

export type Quantization = (typeof QUANTIZATIONS)[keyof typeof QUANTIZATIONS];
