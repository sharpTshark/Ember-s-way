<script setup>
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '../../store/playerStore'
import StatBar from './StatBar.vue'

const { hunger, thirst, warmth, sanity, energy } = storeToRefs(usePlayerStore())
</script>

<template>
  <div class="hud">
    <StatBar label="Hunger" icon="meat" :value="hunger" color="#c98a3b" show-percent />
    <StatBar label="Thirst" icon="water" :value="thirst" color="#3b7fc9" show-percent />
    <StatBar label="Warmth" icon="thermometer" :value="warmth" color="#e08a3c" show-percent />
    <StatBar label="Sanity" icon="brain" :value="sanity" color="#9a5cc9" show-percent />
    <StatBar label="Sleep" icon="zzz" :value="energy" color="#5cc99e" show-percent />
  </div>
</template>

<style scoped>
.hud {
  position: absolute;
  top: 4.5rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 10.5rem;
  padding: 0.6rem;
  background: rgba(10, 12, 10, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  pointer-events: none;
}
</style>
