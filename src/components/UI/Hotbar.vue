<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { EventBus } from '../../game/EventBus'
import { useWeaponStore } from '../../store/weaponStore'
import { gameConfig } from '../../config/gameConfig'
import Icon from './Icon.vue'

const KEYS = ['1', '2', '3']
const SLOT_ICONS = ['sword', 'boot', 'potion']

const weaponStore = useWeaponStore()
const { equipped, equippedSkills, equippedProgress } = storeToRefs(weaponStore)

const slots = computed(() =>
  KEYS.map((key, index) => ({
    key,
    icon: SLOT_ICONS[index],
    skill: equippedSkills.value.find((s) => s.slot === index) ?? null,
  }))
)

const weaponLabel = computed(
  () => `${gameConfig.weapons[equipped.value].label.toUpperCase()} - LV ${equippedProgress.value.level}`
)

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
      <div v-for="(slot, index) in slots" :key="slot.key" class="hotbar-slot">
        <button
          class="hotbar-slot__button"
          :class="{ 'hotbar-slot__button--active': activeIndex === index, 'hotbar-slot__button--locked': !slot.skill }"
          @click="triggerSlot(index)"
        >
          <Icon :name="slot.icon" :size="28" />
        </button>
        <span class="hotbar-slot__name">{{ slot.skill ? slot.skill.label : 'Locked' }}</span>
        <span class="hotbar-slot__key">[{{ slot.key }}]</span>
      </div>
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
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c9a35c;
  text-shadow: 0 0 3px #000;
}

.hotbar {
  display: flex;
  gap: 0.6rem;
}

.hotbar-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
}

.hotbar-slot__button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
  background: rgba(10, 12, 10, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s ease-out, border-color 0.1s ease-out;
}

.hotbar-slot__button--active {
  background: rgba(242, 193, 78, 0.35);
  border-color: #f2c14e;
}

.hotbar-slot__button--locked {
  opacity: 0.35;
  cursor: default;
}

.hotbar-slot__name {
  font-size: 0.65rem;
  color: #e8e8e8;
  text-shadow: 0 0 3px #000;
  white-space: nowrap;
}

.hotbar-slot__key {
  font-size: 0.6rem;
  color: #9c9c9c;
}
</style>
