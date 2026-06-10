import Phaser from 'phaser'
import { Entity } from './Entity'

const CHEST_DEFINITION = { size: 26, color: 0x7a5230 }

function rollLoot(lootTable) {
  const totalWeight = lootTable.reduce((sum, entry) => sum + entry.weight, 0)
  let roll = Phaser.Math.FloatBetween(0, totalWeight)

  for (const entry of lootTable) {
    if (roll < entry.weight) {
      const [min, max] = entry.amount
      return { item: entry.item, amount: Phaser.Math.Between(min, max) }
    }
    roll -= entry.weight
  }

  const fallback = lootTable[0]
  return { item: fallback.item, amount: fallback.amount[0] }
}

export class Chest extends Entity {
  constructor(scene, x, y, definition) {
    super(scene, x, y, { ...CHEST_DEFINITION, entityType: 'chest' })

    this.interactRange = definition.interactRange
    this.lootTable = definition.lootTable
    this.minLootRolls = definition.minLootRolls
    this.maxLootRolls = definition.maxLootRolls
    this.opened = false

    this.setStrokeStyle(2, 0x4a3219)
    this.setInteractive({ useHandCursor: true })
  }

  isInRange(player) {
    return Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <= this.interactRange
  }

  open() {
    if (this.opened) return null
    this.opened = true

    this.setFillStyle(0x4a3219)
    this.disableInteractive()
    this.scene.tweens.add({ targets: this, scaleY: 0.6, duration: 200, ease: 'Bounce.Out' })

    const rollCount = Phaser.Math.Between(this.minLootRolls, this.maxLootRolls)
    const loot = []
    for (let i = 0; i < rollCount; i++) loot.push(rollLoot(this.lootTable))
    return loot
  }
}
