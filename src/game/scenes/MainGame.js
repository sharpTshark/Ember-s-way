import Phaser from 'phaser'
import { EventBus } from '../EventBus'
import { Player } from '../entities/Player'
import { ResourceNode, RESOURCE_NODE_TYPES } from '../entities/ResourceNode'
import { Enemy } from '../entities/Enemy'
import { Chest } from '../entities/Chest'
import { WEAPONS, unlockedSkills } from '../combat/weapons'

const WORLD_SIZE = 1600
const TILE_SIZE = 64
const NODE_COUNT = 40
const ENEMY_COUNT = 10
const CHEST_COUNT = 6

export class MainGame extends Phaser.Scene {
  constructor() {
    super('MainGame')
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_SIZE, WORLD_SIZE)
    this.drawGroundGrid()

    this.player = new Player(this, WORLD_SIZE / 2, WORLD_SIZE / 2)
    this.cameras.main.setBounds(0, 0, WORLD_SIZE, WORLD_SIZE)
    this.cameras.main.startFollow(this.player, true)

    this.harvestTarget = null
    this.spawnResourceNodes()

    this.chestTarget = null
    this.spawnChests()

    this.combatTarget = null
    this.equippedWeapon = 'sword'
    this.weaponLevel = 1
    this.lastAttackAt = 0
    this.spawnEnemies()

    this.input.on('pointerdown', (pointer) => {
      const world = this.cameras.main.getWorldPoint(pointer.x, pointer.y)
      this.player.moveTo(world.x, world.y)
      this.harvestTarget = null
      this.combatTarget = null
      this.chestTarget = null
    })

    EventBus.on('hotbar-input', this.onHotbarInput, this)
    EventBus.on('weapon-equipped', this.onWeaponEquipped, this)
    EventBus.on('weapon-progress', this.onWeaponProgress, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventBus.off('hotbar-input', this.onHotbarInput, this)
      EventBus.off('weapon-equipped', this.onWeaponEquipped, this)
      EventBus.off('weapon-progress', this.onWeaponProgress, this)
    })

    // Placeholder survival stats, sent to Vue via the bridge until real systems exist.
    this.stats = { health: 100, hunger: 100, thirst: 100, warmth: 100, sanity: 100, energy: 100 }
    this.statsTimer = this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => EventBus.emit('player-stats', { ...this.stats }),
    })

    EventBus.emit('current-scene-ready', this)
  }

  spawnResourceNodes() {
    this.resourceNodes = this.add.group()
    const spawnMargin = TILE_SIZE * 2

    for (let i = 0; i < NODE_COUNT; i++) {
      const type = Phaser.Utils.Array.GetRandom(RESOURCE_NODE_TYPES)
      const x = Phaser.Math.Between(spawnMargin, WORLD_SIZE - spawnMargin)
      const y = Phaser.Math.Between(spawnMargin, WORLD_SIZE - spawnMargin)
      const node = new ResourceNode(this, x, y, type)
      node.on('pointerdown', (pointer, _x, _y, event) => {
        event.stopPropagation()
        this.harvestTarget = node
        this.player.moveTo(node.x, node.y)
      })
      this.resourceNodes.add(node)
    }
  }

  pursueHarvestTarget() {
    const node = this.harvestTarget
    if (!node || !node.active) {
      this.harvestTarget = null
      return
    }

    if (node.depleted) {
      this.harvestTarget = null
      return
    }

    if (!node.isInRange(this.player)) return

    this.player.moveTo(this.player.x, this.player.y)
    node.harvest((loot) => {
      EventBus.emit('item-gathered', loot)
    })
    this.harvestTarget = null
  }

  spawnChests() {
    this.chests = this.add.group()
    const spawnMargin = TILE_SIZE * 2

    for (let i = 0; i < CHEST_COUNT; i++) {
      const x = Phaser.Math.Between(spawnMargin, WORLD_SIZE - spawnMargin)
      const y = Phaser.Math.Between(spawnMargin, WORLD_SIZE - spawnMargin)
      const chest = new Chest(this, x, y)
      chest.on('pointerdown', (pointer, _x, _y, event) => {
        event.stopPropagation()
        this.harvestTarget = null
        this.combatTarget = null
        this.chestTarget = chest
        this.player.moveTo(chest.x, chest.y)
      })
      this.chests.add(chest)
    }
  }

  pursueChestTarget() {
    const chest = this.chestTarget
    if (!chest || !chest.active || chest.opened) {
      this.chestTarget = null
      return
    }

    if (!chest.isInRange(this.player)) return

    this.player.moveTo(this.player.x, this.player.y)
    const loot = chest.open()
    if (loot) loot.forEach((drop) => EventBus.emit('item-gathered', drop))
    this.chestTarget = null
  }

  spawnEnemies() {
    this.enemies = this.add.group()
    const spawnMargin = TILE_SIZE * 2

    for (let i = 0; i < ENEMY_COUNT; i++) {
      const x = Phaser.Math.Between(spawnMargin, WORLD_SIZE - spawnMargin)
      const y = Phaser.Math.Between(spawnMargin, WORLD_SIZE - spawnMargin)
      const enemy = new Enemy(this, x, y)
      enemy.on('pointerdown', (pointer, _x, _y, event) => {
        event.stopPropagation()
        this.harvestTarget = null
        this.combatTarget = enemy
        this.player.moveTo(enemy.x, enemy.y)
      })
      this.enemies.add(enemy)
    }
  }

  pursueCombatTarget(time) {
    const enemy = this.combatTarget
    if (!enemy || !enemy.active || enemy.dead) {
      this.combatTarget = null
      return
    }

    const weapon = WEAPONS[this.equippedWeapon]
    const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y)

    if (distance > weapon.range) {
      this.player.moveTo(enemy.x, enemy.y)
      return
    }

    this.player.moveTo(this.player.x, this.player.y)
    if (time - this.lastAttackAt < weapon.cooldownMs) return

    this.lastAttackAt = time
    const damage = Phaser.Math.Between(weapon.minDamage, weapon.maxDamage)
    enemy.takeDamage(damage)
    EventBus.emit('weapon-hit', { weaponId: this.equippedWeapon, xp: weapon.xpPerHit, damage })

    if (enemy.dead) this.combatTarget = null
  }

  onWeaponEquipped(weaponId) {
    if (WEAPONS[weaponId]) this.equippedWeapon = weaponId
  }

  onWeaponProgress({ weaponId, level }) {
    if (weaponId === this.equippedWeapon) this.weaponLevel = level
  }

  castSkill(skill) {
    const enemy = this.combatTarget
    const targetText = enemy && enemy.active && !enemy.dead ? ' on target' : ''
    console.log(`[MainGame] cast ${skill.label} (${skill.id})${targetText}`)

    if (enemy && enemy.active && !enemy.dead) {
      const weapon = WEAPONS[this.equippedWeapon]
      const damage = Phaser.Math.Between(weapon.minDamage, weapon.maxDamage) * 2
      enemy.takeDamage(damage)
      EventBus.emit('weapon-hit', { weaponId: this.equippedWeapon, xp: weapon.xpPerHit, damage })
      if (enemy.dead) this.combatTarget = null
    }
  }

  drawGroundGrid() {
    const graphics = this.add.graphics()
    graphics.lineStyle(1, 0x2f3a2f, 0.6)
    for (let x = 0; x <= WORLD_SIZE; x += TILE_SIZE) {
      graphics.lineBetween(x, 0, x, WORLD_SIZE)
    }
    for (let y = 0; y <= WORLD_SIZE; y += TILE_SIZE) {
      graphics.lineBetween(0, y, WORLD_SIZE, y)
    }

    this.add.rectangle(WORLD_SIZE / 2, WORLD_SIZE / 2, WORLD_SIZE, WORLD_SIZE, 0x1c241c).setDepth(-1)
  }

  onHotbarInput(slotIndex) {
    const skill = unlockedSkills(this.equippedWeapon, this.weaponLevel).find((s) => s.slot === slotIndex)
    if (!skill) {
      console.log(`[MainGame] hotbar slot ${slotIndex}: no skill unlocked yet`)
      return
    }
    this.castSkill(skill)
  }

  update(time) {
    this.player?.update()
    this.enemies?.getChildren().forEach((enemy) => enemy.update())
    this.pursueHarvestTarget()
    this.pursueChestTarget()
    this.pursueCombatTarget(time)
  }
}
