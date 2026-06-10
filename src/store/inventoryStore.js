import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { gameConfig } from '../config/gameConfig'

export const INVENTORY_SLOT_COUNT = gameConfig.inventorySlotCount
const ITEM_DEFS = gameConfig.items

export const useInventoryStore = defineStore('inventory', () => {
  // Each slot is either null or { item, amount }
  const slots = ref(Array.from({ length: INVENTORY_SLOT_COUNT }, () => null))

  const totalWeight = computed(() =>
    slots.value.reduce((sum, slot) => {
      if (!slot) return sum
      const def = ITEM_DEFS[slot.item]
      return sum + (def ? def.weight * slot.amount : 0)
    }, 0)
  )

  function itemDef(item) {
    return ITEM_DEFS[item] ?? { label: item, color: '#888888', weight: 0 }
  }

  // Stacks onto an existing slot of the same item if present, otherwise fills the first empty slot.
  function addItem(item, amount) {
    const existing = slots.value.find((slot) => slot?.item === item)
    if (existing) {
      existing.amount += amount
      return true
    }

    const emptyIndex = slots.value.findIndex((slot) => slot === null)
    if (emptyIndex === -1) return false

    slots.value[emptyIndex] = { item, amount }
    return true
  }

  function clear() {
    slots.value = Array.from({ length: INVENTORY_SLOT_COUNT }, () => null)
  }

  return { slots, totalWeight, itemDef, addItem, clear }
})
