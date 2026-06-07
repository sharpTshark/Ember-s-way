<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { createGame } from './game/main'
import { EventBus } from './game/EventBus'
import { usePlayerStore } from './store/playerStore'

const containerRef = ref(null)
let game = null

const playerStore = usePlayerStore()

function onPlayerStats(stats) {
  playerStore.applyStats(stats)
}

onMounted(() => {
  game = createGame(containerRef.value)
  EventBus.on('player-stats', onPlayerStats)
})

onUnmounted(() => {
  EventBus.off('player-stats', onPlayerStats)
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
