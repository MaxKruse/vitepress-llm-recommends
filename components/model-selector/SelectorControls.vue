<script setup lang="ts">
const props = defineProps<{
  ram: number
  vram: number
  ramOptions: number[]
  vramOptions: number[]
}>()

const emit = defineEmits<{
  (event: 'update:ram', value: number): void
  (event: 'update:vram', value: number): void
}>()

function updateRam(event: Event) {
  emit('update:ram', Number((event.target as HTMLSelectElement).value))
}

function updateVram(event: Event) {
  emit('update:vram', Number((event.target as HTMLSelectElement).value))
}
</script>

<template>
  <div :class="$style.controls">
    <label :class="$style.group">
      <span :class="$style.label">RAM (GB)</span>
      <select :value="props.ram" :class="$style.select" @change="updateRam">
        <option
          v-for="option in props.ramOptions"
          :key="`ram-${option}`"
          :value="option"
          :selected="option === props.ram"
        >
          {{ option }}
        </option>
      </select>
    </label>

    <label :class="$style.group">
      <span :class="$style.label">VRAM (GB)</span>
      <select :value="props.vram" :class="$style.select" @change="updateVram">
        <option
          v-for="option in props.vramOptions"
          :key="`vram-${option}`"
          :value="option"
          :selected="option === props.vram"
        >
          {{ option }}
        </option>
      </select>
    </label>
  </div>
</template>

<style module>
.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.select {
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
</style>
