<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useInventoryStore } from '../../store/inventoryStore'
import Icon from './Icon.vue'

const inventoryStore = useInventoryStore()
const { slots } = storeToRefs(inventoryStore)

const previewSlots = computed(() => slots.value.filter((slot) => slot !== null).slice(0, 4))
</script>

<template>
  <div class="inventory-preview">
    <div v-for="(slot, index) in previewSlots" :key="index" class="inventory-preview__item">
      <Icon :name="inventoryStore.itemDef(slot.item).icon" :size="20" />
      <span class="inventory-preview__count">x{{ slot.amount }}</span>
    </div>
    <div v-if="previewSlots.length === 0" class="inventory-preview__empty">Empty</div>
  </div>
</template>

<style scoped>
.inventory-preview {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0.6rem;
  background: rgba(10, 12, 10, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  pointer-events: none;
}

.inventory-preview__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.inventory-preview__count {
  font-size: 0.6rem;
  color: #cfcfcf;
  font-variant-numeric: tabular-nums;
}

.inventory-preview__empty {
  font-size: 0.7rem;
  color: #888;
  padding: 0.2rem 0.4rem;
}
</style>
