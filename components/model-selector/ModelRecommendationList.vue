<script setup lang="ts">
import { getUsageLinks } from './constants/usage'
import type { AggregatedRecommendation } from './types'
import UsageTag from './UsageTag.vue'
import {
  calculateFileSizeGb,
  getLmStudioUri,
  hasVisionAdapter,
} from './utils'

const props = defineProps<{
  items: AggregatedRecommendation[]
}>()
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

      <div :class="$style.tableWrap">
        <table :class="$style.table">
          <thead>
            <tr>
              <th>Modelname (B params)</th>
              <th>Quant</th>
              <th>Usages</th>
              <th>LMStudio</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in props.items"
              :key="item.name"
            >
              <td :class="$style.modelCell">
                <div :class="$style.modelMain">
                  <strong :class="$style.modelName">{{ item.name }}</strong>
                  <span v-if="hasVisionAdapter(item.name)" :class="$style.visionBadge">Vision</span>
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
                <span v-else :class="$style.muted">—</span>
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

.visionBadge {
  display: inline-flex;
  align-items: center;
  padding: 0.08rem 0.3rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 5px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.64rem;
  font-weight: 600;
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

  .tableWrap {
    padding-inline: 0.55rem;
  }

  .table th,
  .table td {
    padding-inline: 0.4rem;
  }
}
</style>
