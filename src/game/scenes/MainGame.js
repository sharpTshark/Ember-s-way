import Phaser from 'phaser'
import { EventBus } from '../EventBus'
import { Player } from '../entities/Player'

const WORLD_SIZE = 1600
const TILE_SIZE = 64

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

    this.input.on('pointerdown', (pointer) => {
      const world = this.cameras.main.getWorldPoint(pointer.x, pointer.y)
      this.player.moveTo(world.x, world.y)
    })

    EventBus.on('hotbar-input', this.onHotbarInput, this)
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      EventBus.off('hotbar-input', this.onHotbarInput, this)
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
    // Temporary proof that Vue input reaches Phaser; replaced by real skill dispatch later.
    console.log(`[MainGame] hotbar slot ${slotIndex} triggered`)
  }

  update() {
    this.player?.update()
  }
}
