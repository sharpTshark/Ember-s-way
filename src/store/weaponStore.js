import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Weapon, createWeapons } from '../game/combat/Weapon'
import { gameConfig } from '../config/gameConfig'

const weapons = createWeapons(gameConfig.weapons)

function freshXp() {
  return Object.fromEntries(Object.keys(weapons).map((id) => [id, 0]))
}

export const useWeaponStore = defineStore('weapon', () => {
  const equipped = ref(gameConfig.startingWeapon)
  const xp = ref(freshXp())

  const progress = computed(() => {
    const result = {}
    for (const id of Object.keys(weapons)) {
      result[id] = Weapon.levelFromXp(xp.value[id] ?? 0)
    }
    return result
  })

  const equippedProgress = computed(() => progress.value[equipped.value])

  const equippedSkills = computed(() => weapons[equipped.value].unlockedSkills(equippedProgress.value.level))

  function addXp(weaponId, amount) {
    if (xp.value[weaponId] === undefined) return
    const before = Weapon.levelFromXp(xp.value[weaponId]).level
    xp.value[weaponId] += amount
    const after = Weapon.levelFromXp(xp.value[weaponId]).level
    return after > before ? after : null
  }

  function equip(weaponId) {
    if (weapons[weaponId]) equipped.value = weaponId
  }

  function reset() {
    xp.value = freshXp()
    equipped.value = gameConfig.startingWeapon
  }

  return { equipped, xp, progress, equippedProgress, equippedSkills, addXp, equip, reset }
})
