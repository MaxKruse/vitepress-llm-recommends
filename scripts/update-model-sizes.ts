/**
 * Fetches the actual GGUF file sizes for every recommended model+quantization
 * from Hugging Face and rewrites the fixture arrays in utils.test.ts in-place.
 *
 * Usage:
 *   bun run models:update
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ---------------------------------------------------------------------------
// Model catalogue — mirrors MODEL_RECOMMENDATION_PROFILES in recommendations.ts
// ---------------------------------------------------------------------------

const VISION_ADAPTER_GB = 1.9;

type ModelEntry = {
  /** Display name used in the fixture (matches MODEL_NAMES values) */
  name: string;
  /** Hugging Face repo, e.g. "unsloth/Qwen3.6-27B-GGUF" */
  repo: string;
  /** Quantization string, e.g. "Q4_K_M" */
  quantization: string;
  /** True if this model ships a separate vision adapter file */
  isVision?: boolean;
};

const MODELS: ModelEntry[] = [
  {
    name: "Qwen3 Coder Next",
    repo: "unsloth/Qwen3-Coder-Next-GGUF",
    quantization: "Q4_K_M",
  },
  {
    name: "GLM 4.7 Flash",
    repo: "unsloth/GLM-4.7-Flash-GGUF",
    quantization: "Q4_K_M",
  },
  {
    name: "Gemma 4 26B A4B",
    repo: "unsloth/gemma-4-26b-a4b-it-GGUF",
    quantization: "Q4_K_M",
  },
  {
    name: "Qwen3.6 35B A3B",
    repo: "unsloth/Qwen3.6-35B-A3B-GGUF",
    quantization: "Q4_K_M",
  },
  {
    name: "Qwen3.6 27B",
    repo: "unsloth/Qwen3.6-27B-GGUF",
    quantization: "Q4_K_M",
  },
  {
    name: "Qwen3 4B Instruct 2507",
    repo: "unsloth/Qwen3-4B-Instruct-2507-GGUF",
    quantization: "Q8_0",
  },
  // Vision models (GGUF size only; adapter is added separately)
  {
    name: "Qwen3 VL 32B Instruct",
    repo: "unsloth/Qwen3-VL-32B-Instruct-GGUF",
    quantization: "Q6_K_XL",
    isVision: true,
  },
  {
    name: "Qwen3 VL 8B Instruct",
    repo: "unsloth/Qwen3-VL-8B-Instruct-GGUF",
    quantization: "Q4_K_M",
    isVision: true,
  },
  {
    name: "Qwen3 VL 4B Instruct",
    repo: "unsloth/Qwen3-VL-4B-Instruct-GGUF",
    quantization: "Q4_K_M",
    isVision: true,
  },
];

// ---------------------------------------------------------------------------
// Model name → TypeScript MODEL_NAMES constant key
// ---------------------------------------------------------------------------

const MODEL_NAME_TO_TS_KEY: Record<string, string> = {
  "Qwen3 Coder Next": "M.QWEN3_CODER_NEXT",
  "GLM 4.7 Flash": "M.GLM_4_7_FLASH",
  "Gemma 4 26B A4B": "M.GEMMA_4_26B_A4B",
  "Qwen3.6 35B A3B": "M.QWEN3_6_35B_A3B",
  "Qwen3.6 27B": "M.QWEN3_6_27B",
  "Qwen3 4B Instruct 2507": "M.QWEN3_4B_INSTRUCT_2507",
  "Qwen3 VL 32B Instruct": "M.QWEN3_VL_32B_INSTRUCT",
  "Qwen3 VL 8B Instruct": "M.QWEN3_VL_8B_INSTRUCT",
  "Qwen3 VL 4B Instruct": "M.QWEN3_VL_4B_INSTRUCT",
};

// ---------------------------------------------------------------------------
// Quantization string → TypeScript QUANTIZATIONS constant key
// ---------------------------------------------------------------------------

const QUANT_TO_TS_KEY: Record<string, string> = {
  Q4_K_M: "Q.Q4_K_M",
  Q6_K_XL: "Q.Q6_K_XL",
  Q8_0: "Q.Q8_0",
  Q8_K_XL: "Q.Q8_K_XL",
  Q4_K_XL: "Q.Q4_K_XL",
  BF16: "Q.BF16",
  F16: "Q.F16",
  MXFP4: "Q.MXFP4",
};

// ---------------------------------------------------------------------------
// Hugging Face helpers
// ---------------------------------------------------------------------------

type HfTreeEntry = {
  type: "file" | "directory";
  path: string;
  size: number;
};

/** Returns the quantization regex for a given quant string. */
function quantToRegex(q: string): RegExp {
  switch (q) {
    case "Q4_K_M":
      return /Q4[_-]?K[_-]?M/i;
    case "Q6_K_XL":
      return /Q6[_-]?K[_-]?XL/i;
    case "Q8_0":
      return /Q8[_-]?0/i;
    case "MXFP4":
      return /MXFP4|FP4/i;
    default:
      return new RegExp(q.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
  }
}

async function fetchGgufSizeGb(
  repo: string,
  quantization: string,
): Promise<number | null> {
  const url = `https://huggingface.co/api/models/${repo}/tree/main?recursive=1`;

  const response = await fetch(url, {
    headers: { "User-Agent": "vitepress-llm-recommends/models-update" },
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    console.warn(`  ⚠  HF API ${response.status} for ${repo}`);
    return null;
  }

  const entries = (await response.json()) as HfTreeEntry[];
  const pattern = quantToRegex(quantization);

  const matches = entries.filter(
    (e) =>
      e.type === "file" && e.path.endsWith(".gguf") && pattern.test(e.path),
  );

  if (!matches.length) {
    console.warn(`  ⚠  No ${quantization} GGUF found in ${repo}`);
    return null;
  }

  // Pick the smallest shard (single-file uploads are smallest; multi-shard
  // repos will have part files — we want the standalone file when available).
  matches.sort((a, b) => a.size - b.size);
  const picked = matches[0]!;

  const gb = picked.size / 1_073_741_824; // 1024^3
  return Math.round(gb * 100) / 100;
}

// ---------------------------------------------------------------------------
// Fetch all sizes
// ---------------------------------------------------------------------------

type FetchedResult = {
  entry: ModelEntry;
  ggufGb: number;
};

async function fetchAllSizes(): Promise<FetchedResult[]> {
  const results: FetchedResult[] = [];

  for (const entry of MODELS) {
    process.stdout.write(`Fetching ${entry.name} (${entry.quantization})… `);
    const ggufGb = await fetchGgufSizeGb(entry.repo, entry.quantization);

    if (ggufGb === null) {
      console.log("SKIPPED");
      continue;
    }

    console.log(`${ggufGb} GB`);
    results.push({ entry, ggufGb });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Code generation helpers
// ---------------------------------------------------------------------------

function tsKey(name: string): string {
  const key = MODEL_NAME_TO_TS_KEY[name];

  if (!key) {
    throw new Error(
      `Unknown model name "${name}" — add it to MODEL_NAME_TO_TS_KEY`,
    );
  }

  return key;
}

function tsQuant(q: string): string {
  const key = QUANT_TO_TS_KEY[q];

  if (!key) {
    throw new Error(`Unknown quantization "${q}" — add it to QUANT_TO_TS_KEY`);
  }

  return key;
}

function buildGgufBlock(results: FetchedResult[]): string {
  const nonVision = results.filter((r) => !r.entry.isVision);
  const lines = nonVision
    .map(
      ({ entry, ggufGb }) =>
        `  { name: ${tsKey(entry.name)}, quantization: ${tsQuant(entry.quantization)}, actualGb: ${ggufGb} },`,
    )
    .join("\n");

  return (
    `// Actual GGUF file sizes sourced from Hugging Face via HEAD requests (${currentDate()}).\n` +
    `// Vision models are excluded here because calculateFileSizeGb intentionally adds\n` +
    `// a 1.9 GB adapter overhead on top of the base GGUF — testing them against the\n` +
    `// raw GGUF size alone would produce a false failure.\n` +
    `// Tolerance is ±8 % to allow for minor upstream file changes without false failures.\n` +
    `const ACTUAL_GGUF_SIZES_GB: Array<{\n` +
    `  name: ModelName;\n` +
    `  quantization: string;\n` +
    `  actualGb: number;\n` +
    `}> = [\n` +
    lines +
    `\n];`
  );
}

function buildVisionBlock(results: FetchedResult[]): string {
  const vision = results.filter((r) => r.entry.isVision);
  const lines = vision
    .map(
      ({ entry, ggufGb }) =>
        `  { name: ${tsKey(entry.name)}, quantization: ${tsQuant(entry.quantization)}, actualGb: ${ggufGb} + ${VISION_ADAPTER_GB} },`,
    )
    .join("\n");

  return (
    `// Vision models: actual GGUF size + ${VISION_ADAPTER_GB} GB assumed adapter overhead.\n` +
    `const ACTUAL_VISION_SIZES_GB: Array<{\n` +
    `  name: ModelName;\n` +
    `  quantization: string;\n` +
    `  actualGb: number;\n` +
    `}> = [\n` +
    lines +
    `\n];`
  );
}

function currentDate(): string {
  return new Date().toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}

// ---------------------------------------------------------------------------
// File patching
// ---------------------------------------------------------------------------

const GGUF_BLOCK_RE =
  /\/\/ Actual GGUF file sizes[\s\S]*?const ACTUAL_GGUF_SIZES_GB[\s\S]*?^\];/m;

const VISION_BLOCK_RE =
  /\/\/ Vision models: actual GGUF[\s\S]*?const ACTUAL_VISION_SIZES_GB[\s\S]*?^\];/m;

function patchTestFile(filePath: string, results: FetchedResult[]): void {
  let source = readFileSync(filePath, "utf-8");

  const ggufBlock = buildGgufBlock(results);
  const visionBlock = buildVisionBlock(results);

  if (!GGUF_BLOCK_RE.test(source)) {
    throw new Error(
      "Could not locate ACTUAL_GGUF_SIZES_GB block in test file.",
    );
  }

  if (!VISION_BLOCK_RE.test(source)) {
    throw new Error(
      "Could not locate ACTUAL_VISION_SIZES_GB block in test file.",
    );
  }

  source = source.replace(GGUF_BLOCK_RE, ggufBlock);
  source = source.replace(VISION_BLOCK_RE, visionBlock);

  writeFileSync(filePath, source, "utf-8");
  console.log(`\n✓ Patched ${filePath}`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const TEST_FILE = resolve(
  import.meta.dir,
  "../components/model-selector/utils.test.ts",
);

console.log("Fetching GGUF sizes from Hugging Face…\n");
const results = await fetchAllSizes();

if (!results.length) {
  console.error("\n✗ No sizes fetched — aborting.");
  process.exit(1);
}

patchTestFile(TEST_FILE, results);
console.log(
  "\nRun `bun test components/model-selector/utils.test.ts` to verify.",
);
