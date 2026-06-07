import Phaser from 'phaser'

const NODE_CONFIG = {
  tree: { color: 0x3f6b3a, size: 28, item: 'wood', amount: [1, 3], harvestTimeMs: 900, label: 'Tree' },
  rock: { color: 0x8a8a8a, size: 24, item: 'ore', amount: [1, 2], harvestTimeMs: 1300, label: 'Rock' },
  bush: { color: 0x6b8e3a, size: 18, item: 'berries', amount: [1, 4], harvestTimeMs: 600, label: 'Bush' },
}

const INTERACT_RANGE = 64

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
