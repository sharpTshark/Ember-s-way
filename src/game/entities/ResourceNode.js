import Phaser from 'phaser'
import { Entity } from './Entity'

export class ResourceNode extends Entity {
  constructor(scene, x, y, type, definition) {
    super(scene, x, y, { ...definition, entityType: 'resource' })

    this.type = type
    this.itemId = definition.item
    this.amountRange = definition.amount
    this.harvestTimeMs = definition.harvestTimeMs
    this.interactRange = definition.interactRange
    this.depleted = false
    this.harvesting = false

    this.setInteractive({ useHandCursor: true })
  }

  isInRange(player) {
    return Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <= this.interactRange
  }

  harvest(onComplete) {
    if (this.depleted || this.harvesting) return
    this.harvesting = true

    this.scene.tweens.add({
      targets: this,
      scaleX: 0.85,
      scaleY: 0.85,
      yoyo: true,
      repeat: Math.floor(this.harvestTimeMs / 200),
      duration: 100,
    })

    this.scene.time.delayedCall(this.harvestTimeMs, () => {
      if (!this.active) return
      this.harvesting = false
      this.depleted = true
      this.setFillStyle(0x2a2a2a, 0.4)
      this.disableInteractive()

      const [min, max] = this.amountRange
      const amount = Phaser.Math.Between(min, max)
      onComplete({ item: this.itemId, amount, nodeType: this.type })
    })
  }
}
