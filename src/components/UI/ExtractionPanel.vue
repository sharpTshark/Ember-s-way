<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRunStore } from '../../store/runStore'
import Icon from './Icon.vue'

const { extractionRemaining, destination } = storeToRefs(useRunStore())

const formattedTime = computed(() => {
  const minutes = Math.floor(extractionRemaining.value / 60)
  const seconds = extractionRemaining.value % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
})
</script>

<template>
  <div class="extraction-panel">
    <div class="extraction-panel__row">
      <span class="extraction-panel__label">Extract in:</span>
      <span class="extraction-panel__time">{{ formattedTime }}</span>
    </div>
    <div class="extraction-panel__row">
      <Icon name="archway" :size="20" />
      <span class="extraction-panel__destination">{{ destination }}</span>
      <Icon name="arrow" :size="16" />
    </div>
  </div>
</template>

<style scoped>
.extraction-panel {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.6rem 0.75rem;
  background: rgba(10, 12, 10, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #e8e8e8;
  font-size: 0.75rem;
  pointer-events: none;
}

.extraction-panel__row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.extraction-panel__label {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #c9c9c9;
}

.extraction-panel__time {
  font-weight: bold;
  font-variant-numeric: tabular-nums;
  color: #f2c14e;
}

.extraction-panel__destination {
  flex: 1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: bold;
}
</style>
