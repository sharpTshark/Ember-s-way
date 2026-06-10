import Phaser from 'phaser'

// A Weapon turns plain config data into behavior: rolling damage, checking
// range/cooldown, and reporting which skills are unlocked at a given level.
export class Weapon {
  constructor(id, definition) {
    this.id = id
    this.label = definition.label
    this.range = definition.range
    this.cooldownMs = definition.cooldownMs
    this.minDamage = definition.minDamage
    this.maxDamage = definition.maxDamage
    this.xpPerHit = definition.xpPerHit
    this.skills = definition.skills
  }

  rollDamage(multiplier = 1) {
    return Phaser.Math.Between(this.minDamage, this.maxDamage) * multiplier
  }

  isInRange(distance) {
    return distance <= this.range
  }

  isOffCooldown(time, lastAttackAt) {
    return time - lastAttackAt >= this.cooldownMs
  }

  unlockedSkills(level) {
    return this.skills.filter((skill) => skill.level <= level)
  }

  // XP required to go from "level" to "level + 1".
  static xpForLevel(level) {
    return Math.round(50 * Math.pow(level, 1.4))
  }

  static levelFromXp(xp) {
    let level = 1
    let remaining = xp
    while (remaining >= Weapon.xpForLevel(level)) {
      remaining -= Weapon.xpForLevel(level)
      level += 1
    }
    return { level, currentXp: remaining, xpToNext: Weapon.xpForLevel(level) }
  }
}

// Builds a { [weaponId]: Weapon } map from the weapons section of gameConfig.
export function createWeapons(weaponDefinitions) {
  const weapons = {}
  for (const [id, definition] of Object.entries(weaponDefinitions)) {
    weapons[id] = new Weapon(id, definition)
  }
  return weapons
}
