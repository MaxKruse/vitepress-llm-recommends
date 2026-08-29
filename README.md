# vitepress-llm-recommends

VitePress site that recommends local LLMs (GGUF) based on your hardware (RAM + VRAM) and intended use.

## Commands

| Command | Purpose |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run docs:dev` | Start the dev server |
| `bun run docs:build` | Build the static site into `docs/` |
| `bun run docs:preview` | Preview the production build |
| `bun run models:update` | Refresh GGUF file sizes from Hugging Face into the size tables |
| `bun test components/model-selector/utils.test.ts` | Run the selector tests |

## Size data

`bun run models:update` queries the Hugging Face API for every model + quantization in the catalogue (`scripts/update-model-sizes.ts`) and rewrites the size blocks in:

- `components/model-selector/constants/model-size-estimates.ts` (runtime estimates)
- `components/model-selector/utils.test.ts` (verified-size fixtures)

Vision models ship a separate mmproj adapter file; its size is included in the stored values.
