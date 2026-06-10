import { defineStore } from 'pinia'
import { ref } from 'vue'
import { gameConfig } from '../config/gameConfig'

export const useRunStore = defineStore('run', () => {
  const extractionRemaining = ref(gameConfig.extraction.durationSeconds)
  const destination = ref(gameConfig.extraction.destination)

  function applyExtractionTimer({ remaining, destination: dest }) {
    extractionRemaining.value = remaining
    if (dest) destination.value = dest
  }

  return { extractionRemaining, destination, applyExtractionTimer }
})
