import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { levelFromXp, unlockedSkills, WEAPONS } from '../game/combat/weapons'

export const useWeaponStore = defineStore('weapon', () => {
  const equipped = ref('sword')
  const xp = ref({ sword: 0, wand: 0 })

  const progress = computed(() => {
    const result = {}
    for (const id of Object.keys(WEAPONS)) {
      result[id] = levelFromXp(xp.value[id] ?? 0)
    }
    return result
  })

  const equippedProgress = computed(() => progress.value[equipped.value])

  const equippedSkills = computed(() => unlockedSkills(equipped.value, equippedProgress.value.level))

  function addXp(weaponId, amount) {
    if (xp.value[weaponId] === undefined) return
    const before = levelFromXp(xp.value[weaponId]).level
    xp.value[weaponId] += amount
    const after = levelFromXp(xp.value[weaponId]).level
    return after > before ? after : null
  }

  function equip(weaponId) {
    if (WEAPONS[weaponId]) equipped.value = weaponId
  }

  function reset() {
    xp.value = { sword: 0, wand: 0 }
    equipped.value = 'sword'
  }

  return { equipped, xp, progress, equippedProgress, equippedSkills, addXp, equip, reset }
})
