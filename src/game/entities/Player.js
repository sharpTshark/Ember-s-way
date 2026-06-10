import { Entity } from './Entity'

export class Player extends Entity {
  constructor(scene, x, y, definition) {
    super(scene, x, y, { ...definition, entityType: 'player' })

    scene.physics.add.existing(this)
    this.body.setCollideWorldBounds(true)

    this.moveSpeed = definition.moveSpeed
    this.arriveThreshold = definition.arriveThreshold
    this.target = null
  }

  moveTo(x, y) {
    this.target = { x, y }
  }

  stop() {
    this.target = null
    this.body.setVelocity(0, 0)
  }

  update() {
    if (!this.target) {
      this.body.setVelocity(0, 0)
      return
    }

    const dx = this.target.x - this.x
    const dy = this.target.y - this.y
    const distance = Math.hypot(dx, dy)

    if (distance < this.arriveThreshold) {
      this.stop()
      return
    }

    const angle = Math.atan2(dy, dx)
    this.body.setVelocity(Math.cos(angle) * this.moveSpeed, Math.sin(angle) * this.moveSpeed)
  }
}
