import Phaser from 'phaser'
import { Entity } from './Entity'

const HEALTH_BAR_WIDTH = 26
const HEALTH_BAR_OFFSET_Y = 20

export class Enemy extends Entity {
  constructor(scene, x, y, definition) {
    super(scene, x, y, { ...definition, entityType: 'enemy' })

    this.homeX = x
    this.homeY = y
    this.wanderRadius = definition.wanderRadius
    this.wanderSpeed = definition.wanderSpeed
    this.wanderTarget = null

    scene.physics.add.existing(this)
    this.setInteractive({ useHandCursor: true })

    this.healthBarBg = scene.add.rectangle(x, y - HEALTH_BAR_OFFSET_Y, HEALTH_BAR_WIDTH, 4, 0x000000, 0.6)
    this.healthBarFill = scene.add.rectangle(x, y - HEALTH_BAR_OFFSET_Y, HEALTH_BAR_WIDTH, 4, definition.color)

    this.pickWanderTarget()
    this.wanderTimer = scene.time.addEvent({
      delay: Phaser.Math.Between(2000, 4000),
      loop: true,
      callback: () => this.pickWanderTarget(),
    })
  }

  pickWanderTarget() {
    if (!this.alive) return
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
    const radius = Phaser.Math.FloatBetween(0, this.wanderRadius)
    this.wanderTarget = {
      x: this.homeX + Math.cos(angle) * radius,
      y: this.homeY + Math.sin(angle) * radius,
    }
  }

  takeDamage(amount) {
    super.takeDamage(amount)
    if (!this.alive) return

    this.updateHealthBar()
    this.scene.tweens.add({ targets: this, alpha: 0.4, duration: 60, yoyo: true })
  }

  updateHealthBar() {
    const ratio = this.health / this.maxHealth
    this.healthBarFill.width = HEALTH_BAR_WIDTH * ratio
    this.healthBarFill.x = this.x - (HEALTH_BAR_WIDTH * (1 - ratio)) / 2
  }

  die() {
    super.die()
    this.body.setVelocity(0, 0)
    this.wanderTimer.remove()
    this.disableInteractive()
    this.healthBarBg.destroy()
    this.healthBarFill.destroy()

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 300,
      onComplete: () => this.destroy(),
    })
  }

  update() {
    if (!this.alive || !this.wanderTarget) return

    const dx = this.wanderTarget.x - this.x
    const dy = this.wanderTarget.y - this.y
    const distance = Math.hypot(dx, dy)

    if (distance < 4) {
      this.body.setVelocity(0, 0)
    } else {
      const angle = Math.atan2(dy, dx)
      this.body.setVelocity(Math.cos(angle) * this.wanderSpeed, Math.sin(angle) * this.wanderSpeed)
    }

    this.healthBarBg.setPosition(this.x, this.y - HEALTH_BAR_OFFSET_Y)
    this.updateHealthBar()
    this.healthBarFill.y = this.y - HEALTH_BAR_OFFSET_Y
  }
}
