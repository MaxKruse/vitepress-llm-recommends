/**
 * Fetches the actual GGUF file sizes for every recommended model+quantization
 * from Hugging Face and rewrites both runtime and test size tables in-place.
 *
 * Usage:
 *   bun run models:update
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// ---------------------------------------------------------------------------
// Model catalogue — mirrors MODEL_RECOMMENDATION_PROFILES in recommendations.ts
// ---------------------------------------------------------------------------

type ModelEntry = {
  /** Display name used in the fixture (matches MODEL_NAMES values) */
  name: string;
  /** Hugging Face repo, e.g. "unsloth/Qwen3.8-27B-GGUF" */
  repo: string;
  /** Quantization string, e.g. "Q4_K_M" */
  quantization: string;
  /** BF16 mmproj adapter size in GB, added to the GGUF size - 0 for text-only models */
  adapterGb?: number;
};

const MODELS: ModelEntry[] = [
  {
    name: "LFM2.5 8B A1B",
    repo: "unsloth/LFM2.5-8B-A1B-GGUF",
    quantization: "Q4_K_M",
  },
  {
    name: "Gemma 4 12B",
    repo: "unsloth/gemma-4-12b-it-GGUF",
    quantization: "Q4_K_M",
    adapterGb: 0.16,
  },
  {
    name: "Gemma 4 26B A4B",
    repo: "unsloth/gemma-4-26B-A4B-it-GGUF",
    quantization: "Q4_K_M",
    adapterGb: 1.11,
  },
  {
    name: "Muse Glimmer 30B",
    repo: "unsloth/Muse-Glimmer-30B-GGUF",
    quantization: "Q4_K_XL",
    adapterGb: 3.58,
  },
  {
    name: "Qwen3.6 35B A3B",
    repo: "unsloth/Qwen3.6-35B-A3B-GGUF",
    quantization: "Q4_K_M",
    adapterGb: 0.84,
  },
  {
    name: "Qwen3.8 27B",
    repo: "unsloth/Qwen3.8-27B-GGUF",
    quantization: "Q4_K_M",
    adapterGb: 0.87,
  },
  {
    name: "Qwen3.8 27B",
    repo: "unsloth/Qwen3.8-27B-GGUF",
    quantization: "Q6_K_XL",
    adapterGb: 0.87,
  },
  {
    name: "Qwen3.8-Flash-Next",
    repo: "unsloth/Qwen3.8-Flash-Next-GGUF",
    quantization: "Q4_K_XL",
    adapterGb: 0.85,
  },
];

// ---------------------------------------------------------------------------
// Model name → TypeScript MODEL_NAMES constant key
// ---------------------------------------------------------------------------

const MODEL_NAME_TO_TS_KEY: Record<string, string> = {
  "LFM2.5 8B A1B": "M.LFM2_5_8B_A1B",
  "Gemma 4 12B": "M.GEMMA_4_12B",
  "Gemma 4 26B A4B": "M.GEMMA_4_26B_A4B",
  "Muse Glimmer 30B": "M.MUSE_GLIMMER_30B",
  "Qwen3.6 35B A3B": "M.QWEN3_6_35B_A3B",
  "Qwen3.8 27B": "M.QWEN3_8_27B",
  "Qwen3.8-Flash-Next": "M.QWEN3_8_FLASH_NEXT",
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

  // Filter out known helper files that are not model weights.
  const likelyWeightFiles = matches.filter(
    ({ path }) => !/imatrix|mmproj|tokenizer|vocab|merges/i.test(path),
  );
  const candidates = likelyWeightFiles.length ? likelyWeightFiles : matches;

  // If a quantization is uploaded as shards, sum all shard files.
  const shardTotals = new Map<string, number>();
  for (const candidate of candidates) {
    const shardPrefix = candidate.path.match(/^(.*)-\d{5}-of-\d{5}\.gguf$/i)?.[1];

    if (!shardPrefix) {
      continue;
    }

    shardTotals.set(
      shardPrefix,
      (shardTotals.get(shardPrefix) ?? 0) + candidate.size,
    );
  }

  let sizeBytes: number;
  if (shardTotals.size) {
    sizeBytes = Math.max(...shardTotals.values());
  } else {
    // For non-sharded uploads, keep the largest matching weight file.
    sizeBytes = Math.max(...candidates.map(({ size }) => size));
  }

  const gb = sizeBytes / 1_073_741_824; // 1024^3
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
  const lines = results
    .map(
      ({ entry, ggufGb }) =>
        `  { name: ${tsKey(entry.name)}, quantization: ${tsQuant(entry.quantization)}, actualGb: ${Math.round((ggufGb + (entry.adapterGb ?? 0)) * 100) / 100} },`,
    )
    .join("\n");

  return (
    `// Actual GGUF file sizes sourced from Hugging Face via HEAD requests (${currentDate()}).\n` +
    `// Includes the separate vision adapter (mmproj) where the model ships one.\n` +
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

function buildRuntimeSizeBlock(results: FetchedResult[]): string {
  const entries = results
    .map(({ entry, ggufGb }) => ({
      name: entry.name,
      quantization: entry.quantization,
      sizeGb: Math.round((ggufGb + (entry.adapterGb ?? 0)) * 100) / 100,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));

  const lines = entries
    .map(
      ({ name, quantization, sizeGb }) =>
        `  { name: ${JSON.stringify(name)}, quantization: ${JSON.stringify(quantization)}, sizeGb: ${sizeGb} },`,
    )
    .join("\n");

  return (
    `// This block is auto-generated by \`bun run models:update\`.\n` +
    `// Keep sorted by model name for stable diffs.\n` +
    `export const MODEL_SIZE_ESTIMATES_GB: ModelSizeEstimateEntry[] = [\n` +
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

const RUNTIME_SIZE_BLOCK_RE =
  /\/\/ This block is auto-generated by `bun run models:update`\.[\s\S]*?export const MODEL_SIZE_ESTIMATES_GB[\s\S]*?^\];/m;

function patchTestFile(filePath: string, results: FetchedResult[]): void {
  let source = readFileSync(filePath, "utf-8");

  const ggufBlock = buildGgufBlock(results);

  if (!GGUF_BLOCK_RE.test(source)) {
    throw new Error(
      "Could not locate ACTUAL_GGUF_SIZES_GB block in test file.",
    );
  }

  source = source.replace(GGUF_BLOCK_RE, ggufBlock);

  writeFileSync(filePath, source, "utf-8");
  console.log(`\n✓ Patched ${filePath}`);
}

function patchRuntimeSizeFile(filePath: string, results: FetchedResult[]): void {
  let source = readFileSync(filePath, "utf-8");
  const runtimeSizeBlock = buildRuntimeSizeBlock(results);

  if (!RUNTIME_SIZE_BLOCK_RE.test(source)) {
    throw new Error(
      "Could not locate MODEL_SIZE_ESTIMATES_GB block in runtime file.",
    );
  }

  source = source.replace(RUNTIME_SIZE_BLOCK_RE, runtimeSizeBlock);

  writeFileSync(filePath, source, "utf-8");
  console.log(`✓ Patched ${filePath}`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const TEST_FILE = resolve(
  import.meta.dir,
  "../components/model-selector/utils.test.ts",
);
const RUNTIME_SIZE_FILE = resolve(
  import.meta.dir,
  "../components/model-selector/constants/model-size-estimates.ts",
);

console.log("Fetching GGUF sizes from Hugging Face…\n");
const results = await fetchAllSizes();

if (!results.length) {
  console.error("\n✗ No sizes fetched — aborting.");
  process.exit(1);
}

patchTestFile(TEST_FILE, results);
patchRuntimeSizeFile(RUNTIME_SIZE_FILE, results);
console.log(
  "\nRun `bun test components/model-selector/utils.test.ts` to verify.",
);
