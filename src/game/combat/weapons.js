// Weapon definitions: every successful hit grants XP toward that weapon's own skill tree.
// Reaching a milestone level unlocks an active skill bound to a hotbar slot.
export const WEAPONS = {
  sword: {
    label: 'Sword',
    range: 48,
    cooldownMs: 800,
    minDamage: 6,
    maxDamage: 10,
    xpPerHit: 4,
    skills: [
      { level: 3, id: 'cleave', label: 'Cleave', cost: { type: 'stamina', amount: 20 }, slot: 0 },
      { level: 6, id: 'whirlwind', label: 'Whirlwind', cost: { type: 'stamina', amount: 35 }, slot: 1 },
      { level: 10, id: 'execute', label: 'Execute', cost: { type: 'stamina', amount: 50 }, slot: 2 },
    ],
  },
  wand: {
    label: 'Wand',
    range: 220,
    cooldownMs: 1100,
    minDamage: 4,
    maxDamage: 8,
    xpPerHit: 5,
    skills: [
      { level: 3, id: 'fireball', label: 'Fireball', cost: { type: 'mana', amount: 25 }, slot: 0 },
      { level: 6, id: 'frostbolt', label: 'Frostbolt', cost: { type: 'mana', amount: 30 }, slot: 1 },
      { level: 10, id: 'arcane-nova', label: 'Arcane Nova', cost: { type: 'mana', amount: 45 }, slot: 2 },
    ],
  },
}

// XP required to go from level N to N+1; index 0 = XP needed to reach level 2.
export function xpForLevel(level) {
  return Math.round(50 * Math.pow(level, 1.4))
}

export function levelFromXp(xp) {
  let level = 1
  let remaining = xp
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level)
    level += 1
  }
  return { level, currentXp: remaining, xpToNext: xpForLevel(level) }
}

export function unlockedSkills(weaponId, level) {
  return WEAPONS[weaponId].skills.filter((skill) => skill.level <= level)
}
