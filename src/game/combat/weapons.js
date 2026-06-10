import { gameConfig } from '../../config/gameConfig'

// Weapon definitions come from the top-level game config.
export const WEAPONS = gameConfig.weapons

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
