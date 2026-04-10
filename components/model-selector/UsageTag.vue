<script setup lang="ts">
import { withBase } from 'vitepress'
import type { UsageLink } from './constants/usage'
import type { UsageHighlightState } from './utils'

const props = withDefaults(defineProps<{
  usage: UsageLink
  state?: UsageHighlightState
}>(), {
  state: 'default',
})
</script>

<template>
  <a
    :href="withBase(props.usage.href)"
    :class="[
      $style.tag,
      props.state === 'highlighted' ? $style.tagHighlighted : '',
      props.state === 'dimmed' ? $style.tagDimmed : '',
    ]"
  >
    {{ props.usage.label }}
  </a>
</template>

<style module>
.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  padding: 0.1rem 0.34rem;
  border-radius: 5px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 0.66rem;
  font-weight: 500;
  line-height: 1.15;
  text-align: center;
  text-decoration: none;
  border: 1px solid var(--vp-c-border);
  white-space: normal;
}

.tag:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.tagHighlighted {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 45%, var(--vp-c-border));
  background: color-mix(in srgb, var(--vp-c-brand-soft) 70%, var(--vp-c-bg));
  color: var(--vp-c-brand-1);
}

.tagDimmed {
  opacity: 0.5;
}

.tag:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
</style>
