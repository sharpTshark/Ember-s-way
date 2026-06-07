<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { EventBus } from '../../game/EventBus'
import { useWeaponStore } from '../../store/weaponStore'
import { WEAPONS } from '../../game/combat/weapons'

const KEYS = ['1', '2', '3']

const weaponStore = useWeaponStore()
const { equipped, equippedSkills, equippedProgress } = storeToRefs(weaponStore)

const slots = computed(() =>
  KEYS.map((key, index) => ({
    key,
    skill: equippedSkills.value.find((s) => s.slot === index) ?? null,
  }))
)

const weaponLabel = computed(() => `${WEAPONS[equipped.value].label} · Lv ${equippedProgress.value.level}`)

const activeIndex = ref(null)

function triggerSlot(index) {
  if (!slots.value[index].skill) return
  activeIndex.value = index
  EventBus.emit('hotbar-input', index)
  setTimeout(() => {
    if (activeIndex.value === index) activeIndex.value = null
  }, 150)
}

function onKeydown(event) {
  const index = KEYS.indexOf(event.key)
  if (index !== -1) triggerSlot(index)
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="hotbar-wrap">
    <div class="hotbar-wrap__weapon">{{ weaponLabel }}</div>
    <div class="hotbar">
      <button
        v-for="(slot, index) in slots"
        :key="slot.key"
        class="hotbar__slot"
        :class="{ 'hotbar__slot--active': activeIndex === index, 'hotbar__slot--locked': !slot.skill }"
        @click="triggerSlot(index)"
      >
        <span class="hotbar__key">{{ slot.key }}</span>
        <span class="hotbar__label">{{ slot.skill ? slot.skill.label : 'Locked' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.hotbar-wrap {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.hotbar-wrap__weapon {
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #c9a35c;
  text-shadow: 0 0 3px #000;
}

.hotbar {
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

.hotbar__slot--locked {
  opacity: 0.4;
  cursor: default;
}

.hotbar__key {
  font-weight: bold;
  font-size: 0.9rem;
}
</style>
