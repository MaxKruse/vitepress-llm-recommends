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
</style>
