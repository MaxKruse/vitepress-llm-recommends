<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  USAGE_DEFINITIONS,
  getUsageLinks,
  type UsageKey,
} from './constants/usage'
import type { AggregatedRecommendation } from './types'
import UsageTag from './UsageTag.vue'
import {
  calculateFileSizeGb,
  getLmStudioUri,
  getUsageHighlightState,
} from './utils'

const props = defineProps<{
  items: AggregatedRecommendation[]
}>()

const activeUsageKeys = ref<UsageKey[]>([])
const hasActiveUsageHighlights = computed(() => activeUsageKeys.value.length > 0)

function toggleUsageHighlight(key: UsageKey) {
  activeUsageKeys.value = activeUsageKeys.value.includes(key)
    ? activeUsageKeys.value.filter((entry) => entry !== key)
    : [...activeUsageKeys.value, key]
}

function clearUsageHighlights() {
  activeUsageKeys.value = []
}

function itemMatchesHighlightedUsage(item: AggregatedRecommendation) {
  if (!activeUsageKeys.value.length) {
    return false
  }

  return getUsageLinks(item.usage).some(({ key }) => activeUsageKeys.value.includes(key))
}
</script>

<template>
  <section v-if="props.items.length" :class="$style.wrapper" aria-label="Model recommendations">
    <details :class="$style.accordion">
      <summary :class="$style.summary">
        <span :class="$style.summaryText">
          <strong :class="$style.summaryTitle">Recommended models</strong>
          <span :class="$style.summaryHint">Click to expand</span>
        </span>

        <span :class="$style.count">
          {{ props.items.length }} option{{ props.items.length === 1 ? '' : 's' }}
        </span>
      </summary>

      <div :class="$style.toolbar">
        <span :class="$style.toolbarLabel">Highlight tags:</span>

        <div :class="$style.filterButtons">
          <button
            v-for="usage in USAGE_DEFINITIONS"
            :key="usage.key"
            type="button"
            :class="[
              $style.filterButton,
              activeUsageKeys.includes(usage.key) ? $style.filterButtonActive : '',
            ]"
            :aria-pressed="activeUsageKeys.includes(usage.key)"
            @click="toggleUsageHighlight(usage.key)"
          >
            {{ usage.label }}
          </button>

          <button
            v-if="hasActiveUsageHighlights"
            type="button"
            :class="[$style.filterButton, $style.clearButton]"
            @click="clearUsageHighlights"
          >
            Clear
          </button>
        </div>
      </div>

      <div :class="$style.tableWrap">
        <table :class="$style.table">
          <thead>
            <tr>
              <th>Modelname (B params)</th>
              <th>Quant</th>
              <th>Usages</th>
              <th>Open in LMStudio</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in props.items"
              :key="item.name"
              :class="[
                hasActiveUsageHighlights
                  ? itemMatchesHighlightedUsage(item)
                    ? $style.rowHighlighted
                    : $style.rowDimmed
                  : '',
              ]"
            >
              <td :class="$style.modelCell">
                <div :class="$style.modelMain">
                  <strong :class="$style.modelName">{{ item.name }}</strong>
                </div>

                <div :class="$style.modelDetails">
                  <span :class="$style.modelMeta">{{ item.parameters }}B params</span>
                  <span :class="$style.dot">•</span>
                  <span :class="$style.sizeHint">
                    ~{{ calculateFileSizeGb(item.parameters, item.quantization, item.name).toFixed(1) }} GB
                  </span>
                </div>
              </td>
              <td>
                <span :class="$style.quant">{{ item.quantization }}</span>
              </td>
              <td>
                <div :class="$style.tags">
                  <UsageTag
                    v-for="usage in getUsageLinks(item.usage)"
                    :key="`${item.name}-${usage.key}`"
                    :usage="usage"
                    :state="getUsageHighlightState(usage.key, activeUsageKeys)"
                  />
                </div>
              </td>
              <td>
                <a
                  v-if="getLmStudioUri(item.name)"
                  :href="getLmStudioUri(item.name) ?? undefined"
                  :class="$style.button"
                >
                  LMStudio
                </a>
                <span v-else :class="$style.muted">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </section>

  <div v-else :class="$style.empty">
    No recommendations match this RAM/VRAM combination yet.
  </div>
</template>

<style module>
.wrapper {
  margin-top: 1rem;
}

.accordion {
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg);
}

.summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  cursor: pointer;
  list-style: none;
  background: var(--vp-c-bg-alt);
}

.summary:hover {
  background: var(--vp-c-bg-soft);
}

.summary::-webkit-details-marker {
  display: none;
}

.summary::after {
  content: '▸';
  flex-shrink: 0;
  font-size: 0.95rem;
  color: var(--vp-c-text-3);
}

.accordion[open] .summary::after {
  content: '▾';
}

.summaryText {
  display: grid;
  gap: 0.15rem;
}

.summaryTitle {
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
}

.summaryHint {
  color: var(--vp-c-text-2);
  font-size: 0.76rem;
}

.count {
  padding: 0.22rem 0.55rem;
  border-radius: 999px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 0.76rem;
  white-space: nowrap;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem 0.75rem;
  padding: 0.7rem 1rem 0.2rem;
}

.toolbarLabel {
  color: var(--vp-c-text-2);
  font-size: 0.74rem;
  font-weight: 600;
}

.filterButtons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.filterButton {
  padding: 0.2rem 0.48rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.68rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
}

.filterButton:hover {
  border-color: var(--vp-c-text-2);
  color: var(--vp-c-text-1);
}

.filterButtonActive {
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 45%, var(--vp-c-border));
  background: color-mix(in srgb, var(--vp-c-brand-soft) 70%, var(--vp-c-bg));
  color: var(--vp-c-brand-1);
}

.clearButton {
  background: transparent;
}

.tableWrap {
  overflow-x: auto;
  padding: 0.35rem 0.7rem 0.75rem;
}

.table {
  width: 100%;
  min-width: 0;
  border-collapse: collapse;
  table-layout: fixed;
}

.table th,
.table td {
  padding: 0.65rem 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
  vertical-align: top;
}

.table th {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}

.table td {
  line-height: 1.35;
}

.table th:nth-child(1),
.table td:nth-child(1) {
  width: 39%;
}

.table th:nth-child(2),
.table td:nth-child(2) {
  width: 12%;
}

.table th:nth-child(3),
.table td:nth-child(3) {
  width: 34%;
}

.table th:nth-child(4),
.table td:nth-child(4) {
  width: 15%;
}

.table tbody tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.table tbody .rowHighlighted td,
.table tbody .rowHighlighted:hover td {
  background: color-mix(in srgb, var(--vp-c-brand-soft) 55%, transparent);
}

.table tbody .rowDimmed td {
  opacity: 0.58;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.modelCell {
  min-width: 0;
}

.modelMain {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
}

.modelDetails {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.22rem;
  margin-top: 0.1rem;
}

.modelName {
  color: var(--vp-c-text-1);
  overflow-wrap: anywhere;
}

.modelMeta,
.sizeHint,
.muted,
.dot {
  color: var(--vp-c-text-2);
  font-size: 0.73rem;
}

.quant {
  display: inline-block;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  font-size: 0.73rem;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.22rem;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 0.7rem;
  font-weight: 600;
}

.button:hover {
  border-color: var(--vp-c-text-2);
}

.empty {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

@media (max-width: 720px) {
  .summary {
    align-items: flex-start;
  }

  .toolbar {
    padding-inline: 0.75rem;
  }

  .tableWrap {
    padding-inline: 0.55rem;
  }

  .table th,
  .table td {
    padding-inline: 0.4rem;
  }
}
</style>
