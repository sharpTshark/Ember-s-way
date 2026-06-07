<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { EventBus } from '../../game/EventBus'

const slots = [
  { key: '1', label: 'Skill I' },
  { key: '2', label: 'Skill II' },
  { key: '3', label: 'Skill III' },
]

const activeIndex = ref(null)

function triggerSlot(index) {
  activeIndex.value = index
  EventBus.emit('hotbar-input', index)
  setTimeout(() => {
    if (activeIndex.value === index) activeIndex.value = null
  }, 150)
}

function onKeydown(event) {
  const index = slots.findIndex((slot) => slot.key === event.key)
  if (index !== -1) triggerSlot(index)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="hotbar">
    <button
      v-for="(slot, index) in slots"
      :key="slot.key"
      class="hotbar__slot"
      :class="{ 'hotbar__slot--active': activeIndex === index }"
      @click="triggerSlot(index)"
    >
      <span class="hotbar__key">{{ slot.key }}</span>
      <span class="hotbar__label">{{ slot.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.hotbar {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
}

.hotbar__slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: rgba(10, 12, 10, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: #e8e8e8;
  font-size: 0.7rem;
  cursor: pointer;
  transition: background 0.1s ease-out, border-color 0.1s ease-out;
}

.hotbar__slot--active {
  background: rgba(242, 193, 78, 0.35);
  border-color: #f2c14e;
}

.hotbar__key {
  font-weight: bold;
  font-size: 0.9rem;
}
</style>
