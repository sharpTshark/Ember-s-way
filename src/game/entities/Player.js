import Phaser from 'phaser'
import { gameConfig } from '../../config/gameConfig'

const { size, color, moveSpeed, arriveThreshold } = gameConfig.player

export class Player extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, size, size, color)
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.body.setCollideWorldBounds(true)
    this.target = null
  }

  moveTo(x, y) {
    this.target = { x, y }
  }

  update() {
    if (!this.target) {
      this.body.setVelocity(0, 0)
      return
    }

    const dx = this.target.x - this.x
    const dy = this.target.y - this.y
    const distance = Math.hypot(dx, dy)

    if (distance < arriveThreshold) {
      this.body.setVelocity(0, 0)
      this.target = null
      return
    }

    const angle = Math.atan2(dy, dx)
    this.body.setVelocity(Math.cos(angle) * moveSpeed, Math.sin(angle) * moveSpeed)
  }
}
