// =============================================================================
// GAME CONFIG — the only file you need to edit to change/finish the game.
//
// Everything here is plain data: numbers, text, and lists. There is no logic
// in this file. Change a number, add an entry to a list, or edit some text —
// the rest of the game will pick it up automatically.
//
// Colors are written as hex codes, e.g. 0xff0000 is red, 0x00ff00 is green.
// =============================================================================

export const gameConfig = {
  // ---------------------------------------------------------------------------
  // General
  // ---------------------------------------------------------------------------
  meta: {
    title: 'Reliquary Drift',
  },

  // Size of the game world and the grid tiles drawn on the ground.
  world: {
    size: 1600,
    tileSize: 64,
  },

  // ---------------------------------------------------------------------------
  // Player
  // ---------------------------------------------------------------------------
  player: {
    size: 24,
    color: 0xf2c14e,
    moveSpeed: 160,
    arriveThreshold: 4,

    // Starting values for every survival stat (0-100).
    startingStats: {
      health: 100,
      stamina: 100,
      hunger: 100,
      thirst: 100,
      warmth: 100,
      sanity: 100,
      energy: 100,
    },
  },

  // ---------------------------------------------------------------------------
  // Extraction (the goal of each run)
  // ---------------------------------------------------------------------------
  extraction: {
    durationSeconds: 600,
    destination: 'RUINED PLAZA',
  },

  // ---------------------------------------------------------------------------
  // Resource nodes (trees, rocks, bushes scattered around the world)
  // ---------------------------------------------------------------------------
  resourceNodes: {
    spawnCount: 40,
    interactRange: 64,

    // Add a new node type by adding a new entry here. "amount" is [min, max]
    // of how many of "item" you get when harvesting finishes.
    types: {
      tree: { color: 0x3f6b3a, size: 28, item: 'wood', amount: [1, 3], harvestTimeMs: 900, label: 'Tree' },
      rock: { color: 0x8a8a8a, size: 24, item: 'ore', amount: [1, 2], harvestTimeMs: 1300, label: 'Rock' },
      bush: { color: 0x6b8e3a, size: 18, item: 'berries', amount: [1, 4], harvestTimeMs: 600, label: 'Bush' },
    },
  },

  // ---------------------------------------------------------------------------
  // Enemies
  // ---------------------------------------------------------------------------
  enemies: {
    spawnCount: 10,
    size: 22,
    color: 0xb33f3f,
    maxHealth: 30,
    wanderRadius: 80,
    wanderSpeed: 40,
  },

  // ---------------------------------------------------------------------------
  // Chests (open for random loot)
  // ---------------------------------------------------------------------------
  chests: {
    spawnCount: 6,
    interactRange: 64,
    minLootRolls: 1,
    maxLootRolls: 3,

    // Higher "weight" = more likely to be picked. "amount" is [min, max].
    lootTable: [
      { item: 'wood', amount: [2, 6], weight: 3 },
      { item: 'ore', amount: [1, 4], weight: 3 },
      { item: 'berries', amount: [2, 5], weight: 2 },
      { item: 'gold', amount: [5, 25], weight: 1 },
    ],
  },

  // ---------------------------------------------------------------------------
  // Items — every item that can appear in the inventory.
  // "icon" must match an icon name available in Icon.vue.
  // ---------------------------------------------------------------------------
  items: {
    wood: { label: 'Wood', color: '#9a6b3f', weight: 1, icon: 'wood' },
    ore: { label: 'Stone', color: '#a8a8a8', weight: 2, icon: 'stone' },
    berries: { label: 'Raw Meat', color: '#c43f5e', weight: 0.5, icon: 'raw_meat' },
    gold: { label: 'Unknown Relic', color: '#b15ce0', weight: 0.1, icon: 'relic' },
  },
  inventorySlotCount: 16,

  // ---------------------------------------------------------------------------
  // Weapons — every successful hit grants XP toward that weapon's skill tree.
  // Reaching a skill's "level" unlocks it on the matching hotbar "slot" (0-2).
  // ---------------------------------------------------------------------------
  weapons: {
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
  },

  // Default weapon equipped at the start of a run. Must be a key from "weapons" above.
  startingWeapon: 'sword',

  // ---------------------------------------------------------------------------
  // Minimap (top-right corner)
  // ---------------------------------------------------------------------------
  minimap: {
    size: 160,
    padding: 16,
    backgroundColor: 0x10160f,
    borderColor: 0xc9a35c,
  },
}
