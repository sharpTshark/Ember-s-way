<script setup>
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '../../store/playerStore'
import StatBar from './StatBar.vue'

const { health, stamina } = storeToRefs(usePlayerStore())
</script>

<template>
  <div class="vitals">
    <StatBar label="Health" :value="health" color="#d64545" size="large" />
    <StatBar label="Stamina" :value="stamina" color="#5cc99e" size="large" />
  </div>
</template>

<style scoped>
.vitals {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 14rem;
  padding: 0.6rem 0.75rem;
  background: rgba(10, 12, 10, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  pointer-events: none;
}
</style>
