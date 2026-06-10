import Phaser from 'phaser'
import { gameConfig } from '../../config/gameConfig'

const INTERACT_RANGE = gameConfig.chests.interactRange
const LOOT_TABLE = gameConfig.chests.lootTable

function rollLoot() {
  const totalWeight = LOOT_TABLE.reduce((sum, entry) => sum + entry.weight, 0)
  let roll = Phaser.Math.FloatBetween(0, totalWeight)

  for (const entry of LOOT_TABLE) {
    if (roll < entry.weight) {
      const [min, max] = entry.amount
      return { item: entry.item, amount: Phaser.Math.Between(min, max) }
    }
    roll -= entry.weight
  }

  const fallback = LOOT_TABLE[0]
  return { item: fallback.item, amount: fallback.amount[0] }
}

export class Chest extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, 26, 20, 0x7a5230)
    this.scene = scene
    this.opened = false

    scene.add.existing(this)
    this.setStrokeStyle(2, 0x4a3219)
    this.setInteractive({ useHandCursor: true })
  }

  isInRange(player) {
    return Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <= INTERACT_RANGE
  }

  open() {
    if (this.opened) return null
    this.opened = true

    this.setFillStyle(0x4a3219)
    this.disableInteractive()
    this.scene.tweens.add({ targets: this, scaleY: 0.6, duration: 200, ease: 'Bounce.Out' })

    const rollCount = Phaser.Math.Between(gameConfig.chests.minLootRolls, gameConfig.chests.maxLootRolls)
    const loot = []
    for (let i = 0; i < rollCount; i++) loot.push(rollLoot())
    return loot
  }
}
