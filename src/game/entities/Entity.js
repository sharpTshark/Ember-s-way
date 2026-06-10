import Phaser from 'phaser'

// Base class for everything that lives in the world: the player, enemies,
// resource nodes, and chests. Holds the pieces every world object shares
// (position, visuals, optional health) so each subclass only adds its own
// behavior on top.
export class Entity extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, definition) {
    super(scene, x, y, definition.size, definition.size, definition.color)

    this.scene = scene
    this.entityType = definition.entityType
    this.maxHealth = definition.maxHealth ?? 0
    this.health = this.maxHealth
    this.alive = true

    scene.add.existing(this)
  }

  takeDamage(amount) {
    if (!this.alive || this.maxHealth === 0) return
    this.health = Math.max(0, this.health - amount)
    if (this.health <= 0) this.die()
  }

  die() {
    this.alive = false
  }

  // Subclasses override this to run their per-frame logic.
  update(_time) {}
}
