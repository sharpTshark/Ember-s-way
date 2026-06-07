<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { createGame } from './game/main'
import { EventBus } from './game/EventBus'
import { usePlayerStore } from './store/playerStore'
import { useInventoryStore } from './store/inventoryStore'

const containerRef = ref(null)
let game = null

const playerStore = usePlayerStore()
const inventoryStore = useInventoryStore()

function onPlayerStats(stats) {
  playerStore.applyStats(stats)
}

function onItemGathered({ item, amount }) {
  inventoryStore.addItem(item, amount)
}

onMounted(() => {
  game = createGame(containerRef.value)
  EventBus.on('player-stats', onPlayerStats)
  EventBus.on('item-gathered', onItemGathered)
})

onUnmounted(() => {
  EventBus.off('player-stats', onPlayerStats)
  EventBus.off('item-gathered', onItemGathered)
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
