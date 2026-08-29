<script setup lang="ts">
import { computed, ref } from 'vue'
import ModelRecommendationList from './model-selector/ModelRecommendationList.vue'
import SelectorControls from './model-selector/SelectorControls.vue'
import { DEFAULT_RECOMMENDATION_RULES } from './model-selector/recommendations'
import type { RecommendationRule } from './model-selector/types'
import { getMatchingRecommendations } from './model-selector/utils'

const props = withDefaults(defineProps<{
  rules?: RecommendationRule[]
  ramOptions?: number[]
  vramOptions?: number[]
  initialRam?: number
  initialVram?: number
}>(), {
  rules: () => DEFAULT_RECOMMENDATION_RULES,
  ramOptions: () => [16, 32, 64, 128],
  vramOptions: () => [8, 12, 16, 24, 32],
  initialRam: 32,
  initialVram: 8,
})

const ram = ref(props.initialRam)
const vram = ref(props.initialVram)

const matches = computed(() => getMatchingRecommendations(ram.value, vram.value, props.rules))
</script>

<style module>
.modelSelector {
  margin: 2rem 0;
  padding: 1.1rem;
  border-radius: 12px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-code-block-bg);
  overflow: hidden;
}

.header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem 1rem;
  margin: 0 0 0.75rem;
}

.titleBlock {
  flex: 1 1 18rem;
  min-width: 0;
}

.heading {
  margin: 0 0 0.35rem;
  color: var(--vp-c-text-1);
}

.copy {
  margin: 0;
  color: var(--vp-c-text-2);
}

.actions {
  flex: 0 0 auto;
}

.requestLink {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 0.85rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 35%, var(--vp-c-border));
  background: color-mix(in srgb, var(--vp-c-brand-soft) 65%, var(--vp-code-block-bg));
  color: var(--vp-c-brand-1);
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.requestLink:hover {
  border-color: var(--vp-c-brand-1);
  background: color-mix(in srgb, var(--vp-c-brand-soft) 85%, var(--vp-code-block-bg));
  color: var(--vp-c-brand-2);
}

.disclaimer {
  margin: 0 0 1rem;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--vp-c-warning-1) 35%, var(--vp-c-border));
  background: color-mix(in srgb, var(--vp-c-warning-soft) 60%, var(--vp-code-block-bg));
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}
</style>

<template>
  <section :class="$style.modelSelector">
    <div :class="$style.header">
      <div :class="$style.titleBlock">
        <h3 :class="$style.heading">Hardware-based recommendations</h3>
        <p :class="$style.copy">
          Pick your system RAM and GPU VRAM to see the current best-fit models. Click any usage tag to jump to the detailed explanation page.
        </p>
      </div>

      <div :class="$style.actions">
        <a
          :class="$style.requestLink"
          href="https://github.com/MaxKruse/vitepress-llm-recommends/issues/new?template=model-request.md"
          target="_blank"
          rel="noreferrer"
        >
          Suggest a model
        </a>
      </div>
    </div>

    <p :class="$style.disclaimer">
      Warning: these model recommendations are personal opinion, based on practical tradeoffs and preferences rather than an objective ranking.
    </p>

    <SelectorControls
      :ram="ram"
      :vram="vram"
      :ram-options="props.ramOptions"
      :vram-options="props.vramOptions"
      @update:ram="ram = $event"
      @update:vram="vram = $event"
    />

    <ModelRecommendationList :items="matches" />
  </section>
</template>