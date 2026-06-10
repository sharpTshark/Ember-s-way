<script setup>
import Icon from './Icon.vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  max: { type: Number, default: 100 },
  color: { type: String, default: '#f2c14e' },
  icon: { type: String, default: null },
  showPercent: { type: Boolean, default: false },
  size: { type: String, default: 'compact' }, // 'compact' | 'large'
})

const percent = () => Math.round((props.value / props.max) * 100)
const width = () => `${Math.max(0, Math.min(100, percent()))}%`
</script>

<template>
  <div class="stat-bar" :class="`stat-bar--${size}`">
    <Icon v-if="icon" :name="icon" :size="size === 'large' ? 18 : 14" />
    <span v-else class="stat-bar__label">{{ label }}</span>
    <div class="stat-bar__track">
      <div class="stat-bar__fill" :style="{ width: width(), backgroundColor: color }" />
    </div>
    <span v-if="showPercent" class="stat-bar__percent">{{ percent() }}%</span>
  </div>
</template>

<style scoped>
.stat-bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  color: #e8e8e8;
}

.stat-bar__label {
  width: 4.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-bar__track {
  flex: 1;
  height: 0.45rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.stat-bar__fill {
  height: 100%;
  transition: width 0.2s ease-out;
}

.stat-bar__percent {
  width: 2.4rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: #cfcfcf;
}

.stat-bar--large .stat-bar__track {
  height: 0.85rem;
  border-radius: 3px;
}

.stat-bar--large {
  gap: 0.5rem;
}
</style>
