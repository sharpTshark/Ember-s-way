<script setup>
import PhaserGame from './PhaserGame.vue'
import TitleHeader from './components/UI/TitleHeader.vue'
import VitalsBar from './components/UI/VitalsBar.vue'
import HUD from './components/UI/HUD.vue'
import Hotbar from './components/UI/Hotbar.vue'
import InventoryGrid from './components/UI/InventoryGrid.vue'
import InventoryPreview from './components/UI/InventoryPreview.vue'
import ExtractionPanel from './components/UI/ExtractionPanel.vue'
</script>

<template>
  <div class="app-shell">
    <PhaserGame />
    <TitleHeader />
    <VitalsBar />
    <HUD />
    <ExtractionPanel />
    <InventoryPreview />
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
