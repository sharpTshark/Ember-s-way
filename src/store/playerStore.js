import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlayerStore = defineStore('player', () => {
  const health = ref(100)
  const hunger = ref(100)
  const thirst = ref(100)
  const warmth = ref(100)
  const sanity = ref(100)
  const energy = ref(100)

  function applyStats(stats) {
    if (stats.health !== undefined) health.value = stats.health
    if (stats.hunger !== undefined) hunger.value = stats.hunger
    if (stats.thirst !== undefined) thirst.value = stats.thirst
    if (stats.warmth !== undefined) warmth.value = stats.warmth
    if (stats.sanity !== undefined) sanity.value = stats.sanity
    if (stats.energy !== undefined) energy.value = stats.energy
  }

  return { health, hunger, thirst, warmth, sanity, energy, applyStats }
})
