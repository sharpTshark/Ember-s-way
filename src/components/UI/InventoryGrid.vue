<script setup>
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '../../store/inventoryStore'

const inventoryStore = useInventoryStore()
const { slots, totalWeight } = storeToRefs(inventoryStore)
</script>

<template>
  <div class="inventory">
    <div class="inventory__header">
      <span>Inventory</span>
      <span class="inventory__weight">{{ totalWeight.toFixed(1) }} kg</span>
    </div>
    <div class="inventory__grid">
      <div v-for="(slot, index) in slots" :key="index" class="inventory__slot">
        <template v-if="slot">
          <span class="inventory__swatch" :style="{ backgroundColor: inventoryStore.itemDef(slot.item).color }" />
          <span class="inventory__amount">{{ slot.amount }}</span>
          <span class="inventory__name">{{ inventoryStore.itemDef(slot.item).label }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inventory {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 14rem;
  padding: 0.75rem;
  background: rgba(10, 12, 10, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #e8e8e8;
  font-size: 0.75rem;
}

.inventory__header {
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.inventory__weight {
  color: #c9a35c;
}

.inventory__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.35rem;
}

.inventory__slot {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  overflow: hidden;
}

.inventory__swatch {
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 2px;
}

.inventory__amount {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-weight: bold;
  font-size: 0.65rem;
  text-shadow: 0 0 2px #000;
}

.inventory__name {
  font-size: 0.55rem;
  margin-top: 2px;
  color: #c9c9c9;
  text-align: center;
}
</style>
