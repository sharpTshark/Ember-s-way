<script setup>
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '../../store/playerStore'
import StatBar from './StatBar.vue'

const { health, hunger, thirst, warmth, sanity, energy } = storeToRefs(usePlayerStore())
</script>

<template>
  <div class="hud">
    <StatBar label="Health" :value="health" color="#d64545" />
    <StatBar label="Hunger" :value="hunger" color="#c98a3b" />
    <StatBar label="Thirst" :value="thirst" color="#3b7fc9" />
    <StatBar label="Warmth" :value="warmth" color="#e08a3c" />
    <StatBar label="Sanity" :value="sanity" color="#9a5cc9" />
    <StatBar label="Sleep" :value="energy" color="#5cc99e" />
  </div>
</template>

<style scoped>
.hud {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 14rem;
  padding: 0.75rem;
  background: rgba(10, 12, 10, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  pointer-events: none;
}
</style>
