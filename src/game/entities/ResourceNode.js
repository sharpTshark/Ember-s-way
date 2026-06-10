import Phaser from 'phaser'
import { gameConfig } from '../../config/gameConfig'

const NODE_CONFIG = gameConfig.resourceNodes.types
const INTERACT_RANGE = gameConfig.resourceNodes.interactRange

export class ResourceNode extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, type) {
    const config = NODE_CONFIG[type]
    super(scene, x, y, config.size, config.size, config.color)
    this.scene = scene
    this.type = type
    this.config = config
    this.depleted = false
    this.harvesting = false

    scene.add.existing(this)
    this.setInteractive({ useHandCursor: true })
  }

  isInRange(player) {
    return Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y) <= INTERACT_RANGE
  }

  harvest(onComplete) {
    if (this.depleted || this.harvesting) return
    this.harvesting = true

    this.scene.tweens.add({
      targets: this,
      scaleX: 0.85,
      scaleY: 0.85,
      yoyo: true,
      repeat: Math.floor(this.config.harvestTimeMs / 200),
      duration: 100,
    })

    this.scene.time.delayedCall(this.config.harvestTimeMs, () => {
      if (!this.active) return
      this.harvesting = false
      this.depleted = true
      this.setFillStyle(0x2a2a2a, 0.4)
      this.disableInteractive()

      const [min, max] = this.config.amount
      const amount = Phaser.Math.Between(min, max)
      onComplete({ item: this.config.item, amount, nodeType: this.type })
    })
  }
}

export const RESOURCE_NODE_TYPES = Object.keys(NODE_CONFIG)
