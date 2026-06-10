import { defineStore } from 'pinia'
import { ref } from 'vue'
import { gameConfig } from '../config/gameConfig'

export const usePlayerStore = defineStore('player', () => {
  const starting = gameConfig.player.startingStats
  const health = ref(starting.health)
  const stamina = ref(starting.stamina)
  const hunger = ref(starting.hunger)
  const thirst = ref(starting.thirst)
  const warmth = ref(starting.warmth)
  const sanity = ref(starting.sanity)
  const energy = ref(starting.energy)

  function applyStats(stats) {
    if (stats.health !== undefined) health.value = stats.health
    if (stats.stamina !== undefined) stamina.value = stats.stamina
    if (stats.hunger !== undefined) hunger.value = stats.hunger
    if (stats.thirst !== undefined) thirst.value = stats.thirst
    if (stats.warmth !== undefined) warmth.value = stats.warmth
    if (stats.sanity !== undefined) sanity.value = stats.sanity
    if (stats.energy !== undefined) energy.value = stats.energy
  }

  return { health, stamina, hunger, thirst, warmth, sanity, energy, applyStats }
})
