import Phaser from 'phaser'
import { EventBus } from '../EventBus'
import { Player } from '../entities/Player'
import { World } from '../world/World'
import { createWeapons } from '../combat/Weapon'
import { CombatController } from '../systems/CombatController'
import { InteractionController } from '../systems/InteractionController'
import { ExtractionTimer } from '../systems/ExtractionTimer'
import { Minimap } from '../systems/Minimap'
import { gameConfig } from '../../config/gameConfig'

// The main game loop: builds the world, spawns the player, wires up the
// systems that drive combat/gathering/extraction, and connects pointer
// input to those systems.
export class MainGame extends Phaser.Scene {
  constructor() {
    super('MainGame')
  }

  create() {
    const { world: worldConfig, player: playerConfig } = gameConfig

    this.physics.world.setBounds(0, 0, worldConfig.size, worldConfig.size)

    this.world = new World(gameConfig)
    this.world.build(this)

    this.player = new Player(this, worldConfig.size / 2, worldConfig.size / 2, playerConfig)
    this.cameras.main.setBounds(0, 0, worldConfig.size, worldConfig.size)
    this.cameras.main.startFollow(this.player, true)

    this.weapons = createWeapons(gameConfig.weapons)
    this.combat = new CombatController(this.player, this.weapons, gameConfig.startingWeapon)
    this.interaction = new InteractionController(this.player)

    this.extractionTimer = new ExtractionTimer(this, gameConfig.extraction)
    this.extractionTimer.start()

    this.minimap = new Minimap(this, gameConfig.minimap, worldConfig.size)
    this.minimap.setup()

    this.registerInputHandlers()
    this.registerEventBusHandlers()

    // Placeholder survival stats, sent to Vue via the bridge until real systems exist.
    this.stats = { ...playerConfig.startingStats }
    this.statsTimer = this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => EventBus.emit('player-stats', { ...this.stats }),
    })

    EventBus.emit('current-scene-ready', this)
  }

  registerInputHandlers() {
    this.input.on('pointerdown', (pointer) => {
      const point = this.cameras.main.getWorldPoint(pointer.x, pointer.y)
      this.player.moveTo(point.x, point.y)
      this.interaction.clearTargets()
      this.combat.clearTarget()
    })

    this.world.resourceNodes.getChildren().forEach((node) => {
      node.on('pointerdown', (pointer, _x, _y, event) => {
        event.stopPropagation()
        this.interaction.setHarvestTarget(node)
        this.player.moveTo(node.x, node.y)
      })
    })

    this.world.chests.getChildren().forEach((chest) => {
      chest.on('pointerdown', (pointer, _x, _y, event) => {
        event.stopPropagation()
        this.interaction.clearTargets()
        this.combat.clearTarget()
        this.interaction.setChestTarget(chest)
        this.player.moveTo(chest.x, chest.y)
      })
    })

    this.world.enemies.getChildren().forEach((enemy) => {
      enemy.on('pointerdown', (pointer, _x, _y, event) => {
        event.stopPropagation()
        this.interaction.clearTargets()
        this.combat.setTarget(enemy)
        this.player.moveTo(enemy.x, enemy.y)
      })
    })
  }

  registerEventBusHandlers() {
    EventBus.on('hotbar-input', this.onHotbarInput, this)
    EventBus.on('weapon-equipped', this.onWeaponEquipped, this)
    EventBus.on('weapon-progress', this.onWeaponProgress, this)

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventBus.off('hotbar-input', this.onHotbarInput, this)
      EventBus.off('weapon-equipped', this.onWeaponEquipped, this)
      EventBus.off('weapon-progress', this.onWeaponProgress, this)
    })
  }

  onWeaponEquipped(weaponId) {
    this.combat.equip(weaponId)
  }

  onWeaponProgress({ weaponId, level }) {
    this.combat.setWeaponLevel(weaponId, level)
  }

  onHotbarInput(slotIndex) {
    const skill = this.combat.weapon.unlockedSkills(this.combat.weaponLevel).find((s) => s.slot === slotIndex)
    if (!skill) return
    this.combat.castSkill(skill)
  }

  update(time) {
    this.player.update()
    this.world.enemies.getChildren().forEach((enemy) => enemy.update())
    this.interaction.update()
    this.combat.update(time)
  }
}
