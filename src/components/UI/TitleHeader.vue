<script setup>
import { storeToRefs } from 'pinia'
import { useWeaponStore } from '../../store/weaponStore'
import { gameConfig } from '../../config/gameConfig'

const { equippedProgress } = storeToRefs(useWeaponStore())
const title = gameConfig.meta.title

const xpPercent = () => Math.round((equippedProgress.value.currentXp / equippedProgress.value.xpToNext) * 100)
</script>

<template>
  <div class="title-header">
    <h1 class="title-header__title">{{ title }}</h1>
    <div class="title-header__xp-track">
      <div class="title-header__xp-fill" :style="{ width: `${xpPercent()}%` }" />
    </div>
  </div>
</template>

<style scoped>
.title-header {
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(32rem, 60vw);
  pointer-events: none;
}

.title-header__title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: #f2c14e;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.8), 0 0 12px rgba(242, 193, 78, 0.35);
}

.title-header__xp-track {
  margin-top: 0.35rem;
  width: 100%;
  height: 0.4rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  overflow: hidden;
}

.title-header__xp-fill {
  height: 100%;
  background: linear-gradient(90deg, #9a5cc9, #f2c14e);
  transition: width 0.2s ease-out;
}
</style>
