import Phaser from 'phaser'

const MOVE_SPEED = 160
const ARRIVE_THRESHOLD = 4

export class Player extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, 24, 24, 0xf2c14e)
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

    if (distance < ARRIVE_THRESHOLD) {
      this.body.setVelocity(0, 0)
      this.target = null
      return
    }

    const angle = Math.atan2(dy, dx)
    this.body.setVelocity(Math.cos(angle) * MOVE_SPEED, Math.sin(angle) * MOVE_SPEED)
  }
}
