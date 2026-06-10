import Phaser from 'phaser'
import { EventBus } from '../EventBus'

// Drives the auto-attack loop: chases the current target into weapon range,
// attacks on cooldown, and reports hits/XP back to Vue through the EventBus.
export class CombatController {
  constructor(player, weapons, startingWeaponId) {
    this.player = player
    this.weapons = weapons
    this.equippedWeaponId = startingWeaponId
    this.weaponLevel = 1
    this.lastAttackAt = 0
    this.target = null
  }

  get weapon() {
    return this.weapons[this.equippedWeaponId]
  }

  setTarget(enemy) {
    this.target = enemy
  }

  clearTarget() {
    this.target = null
  }

  equip(weaponId) {
    if (this.weapons[weaponId]) this.equippedWeaponId = weaponId
  }

  setWeaponLevel(weaponId, level) {
    if (weaponId === this.equippedWeaponId) this.weaponLevel = level
  }

  castSkill(skill) {
    if (!this.target?.alive) return
    this.applyHit(this.weapon.rollDamage(2))
  }

  applyHit(damage) {
    this.target.takeDamage(damage)
    EventBus.emit('weapon-hit', { weaponId: this.equippedWeaponId, xp: this.weapon.xpPerHit, damage })
    if (!this.target.alive) this.clearTarget()
  }

  update(time) {
    const enemy = this.target
    if (!enemy || !enemy.alive) {
      this.target = null
      return
    }

    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y)

    if (!this.weapon.isInRange(distance)) {
      this.player.moveTo(enemy.x, enemy.y)
      return
    }

    this.player.stop()
    if (!this.weapon.isOffCooldown(time, this.lastAttackAt)) return

    this.lastAttackAt = time
    this.applyHit(this.weapon.rollDamage())
  }
}
