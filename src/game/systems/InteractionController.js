import { EventBus } from '../EventBus'

// Drives gathering: walks the player to a clicked resource node or chest,
// then harvests/opens it once in range and emits the loot.
export class InteractionController {
  constructor(player) {
    this.player = player
    this.harvestTarget = null
    this.chestTarget = null
  }

  setHarvestTarget(node) {
    this.harvestTarget = node
  }

  setChestTarget(chest) {
    this.chestTarget = chest
  }

  clearTargets() {
    this.harvestTarget = null
    this.chestTarget = null
  }

  update() {
    this.pursueHarvestTarget()
    this.pursueChestTarget()
  }

  pursueHarvestTarget() {
    const node = this.harvestTarget
    if (!node || !node.active || node.depleted) {
      this.harvestTarget = null
      return
    }

    if (!node.isInRange(this.player)) return

    this.player.stop()
    node.harvest((loot) => EventBus.emit('item-gathered', loot))
    this.harvestTarget = null
  }

  pursueChestTarget() {
    const chest = this.chestTarget
    if (!chest || !chest.active || chest.opened) {
      this.chestTarget = null
      return
    }

    if (!chest.isInRange(this.player)) return

    this.player.stop()
    const loot = chest.open()
    if (loot) loot.forEach((drop) => EventBus.emit('item-gathered', drop))
    this.chestTarget = null
  }
}
