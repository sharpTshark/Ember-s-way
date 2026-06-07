<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { createGame } from './game/main'
import { EventBus } from './game/EventBus'
import { usePlayerStore } from './store/playerStore'
import { useInventoryStore } from './store/inventoryStore'
import { useWeaponStore } from './store/weaponStore'

const containerRef = ref(null)
let game = null

const playerStore = usePlayerStore()
const inventoryStore = useInventoryStore()
const weaponStore = useWeaponStore()

function onPlayerStats(stats) {
  playerStore.applyStats(stats)
}

function onItemGathered({ item, amount }) {
  inventoryStore.addItem(item, amount)
}

function onWeaponHit({ weaponId, xp }) {
  const newLevel = weaponStore.addXp(weaponId, xp)
  EventBus.emit('weapon-progress', { weaponId, level: weaponStore.progress[weaponId].level })
  if (newLevel) EventBus.emit('skill-check', { weaponId, level: newLevel })
}

onMounted(() => {
  game = createGame(containerRef.value)
  EventBus.on('player-stats', onPlayerStats)
  EventBus.on('item-gathered', onItemGathered)
  EventBus.on('weapon-hit', onWeaponHit)
  EventBus.emit('weapon-equipped', weaponStore.equipped)
})

onUnmounted(() => {
  EventBus.off('player-stats', onPlayerStats)
  EventBus.off('item-gathered', onItemGathered)
  EventBus.off('weapon-hit', onWeaponHit)
  game?.destroy(true)
  game = null
})
</script>

<template>
  <div ref="containerRef" class="phaser-container" />
</template>

<style scoped>
.phaser-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
