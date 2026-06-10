import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRunStore = defineStore('run', () => {
  const extractionRemaining = ref(0)
  const destination = ref('RUINED PLAZA')

  function applyExtractionTimer({ remaining, destination: dest }) {
    extractionRemaining.value = remaining
    if (dest) destination.value = dest
  }

  return { extractionRemaining, destination, applyExtractionTimer }
})
