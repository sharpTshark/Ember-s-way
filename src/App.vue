<script setup>
import PhaserGame from './PhaserGame.vue'
import HUD from './components/UI/HUD.vue'
import Hotbar from './components/UI/Hotbar.vue'
import InventoryGrid from './components/UI/InventoryGrid.vue'
</script>

<template>
  <div class="app-shell">
    <PhaserGame />
    <HUD />
    <InventoryGrid />
    <Hotbar />
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0a0c0a;
}
</style>
