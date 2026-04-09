<script setup lang="ts">
import { computed } from 'vue'
import { USE_CASE_COPY, type UseCaseKey } from './recommendations'

const props = defineProps<{
  usageKey: UseCaseKey
}>()

const details = computed(() => USE_CASE_COPY[props.usageKey])
</script>

<template>
  <aside :class="$style.card">
    <p :class="$style.title">{{ details.title }}</p>
    <p :class="$style.summary">{{ details.summary }}</p>
    <p :class="$style.disclaimer">
      Warning: these model recommendations are personal opinion, reflecting individual preferences and tradeoffs rather than a universal ranking.
    </p>
  </aside>
</template>

<style module>
.card {
  margin: 1rem 0 1.5rem;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
}

.title {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.summary {
  margin: 0;
  color: var(--vp-c-text-2);
}

.disclaimer {
  margin: 0.9rem 0 0;
  padding-top: 0.9rem;
  border-top: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
}
</style>
