<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  max: { type: Number, default: 100 },
  color: { type: String, default: '#f2c14e' },
})
</script>

<template>
  <div class="stat-bar">
    <span class="stat-bar__label">{{ label }}</span>
    <div class="stat-bar__track">
      <div
        class="stat-bar__fill"
        :style="{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`, backgroundColor: color }"
      />
    </div>
  </div>
</template>

<style scoped>
.stat-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #e8e8e8;
}

.stat-bar__label {
  width: 4.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-bar__track {
  flex: 1;
  height: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.stat-bar__fill {
  height: 100%;
  transition: width 0.2s ease-out;
}
</style>
