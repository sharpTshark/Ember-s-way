import Phaser from 'phaser'
import { gameConfig } from '../../config/gameConfig'

const { size, color, maxHealth, wanderRadius, wanderSpeed } = gameConfig.enemies

export class Enemy extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, size, size, color)
    this.scene = scene
    this.homeX = x
    this.homeY = y
    this.maxHealth = maxHealth
    this.health = this.maxHealth
    this.dead = false

    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setInteractive({ useHandCursor: true })

    this.healthBarBg = scene.add.rectangle(x, y - 20, 26, 4, 0x000000, 0.6)
    this.healthBarFill = scene.add.rectangle(x, y - 20, 26, 4, 0xb33f3f)

    this.pickWanderTarget()
    this.wanderTimer = scene.time.addEvent({
      delay: Phaser.Math.Between(2000, 4000),
      loop: true,
      callback: () => this.pickWanderTarget(),
    })
  }

  pickWanderTarget() {
    if (this.dead) return
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2)
    const radius = Phaser.Math.FloatBetween(0, wanderRadius)
    this.wanderTarget = {
      x: this.homeX + Math.cos(angle) * radius,
      y: this.homeY + Math.sin(angle) * radius,
    }
  }

  takeDamage(amount) {
    if (this.dead) return
    this.health = Math.max(0, this.health - amount)
    this.updateHealthBar()
    this.scene.tweens.add({ targets: this, alpha: 0.4, duration: 60, yoyo: true })

    if (this.health <= 0) this.die()
  }

  updateHealthBar() {
    const ratio = this.health / this.maxHealth
    this.healthBarFill.width = 26 * ratio
    this.healthBarFill.x = this.x - (26 * (1 - ratio)) / 2
  }

  die() {
    this.dead = true
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
    if (this.dead || !this.wanderTarget) return

    const dx = this.wanderTarget.x - this.x
    const dy = this.wanderTarget.y - this.y
    const distance = Math.hypot(dx, dy)

    if (distance < 4) {
      this.body.setVelocity(0, 0)
    } else {
      const angle = Math.atan2(dy, dx)
      this.body.setVelocity(Math.cos(angle) * wanderSpeed, Math.sin(angle) * wanderSpeed)
    }

    this.healthBarBg.setPosition(this.x, this.y - 20)
    this.healthBarFill.setPosition(this.x - (26 * (1 - this.health / this.maxHealth)) / 2, this.y - 20)
  }
}
