import Phaser from 'phaser'
import { ResourceNode } from '../entities/ResourceNode'
import { Enemy } from '../entities/Enemy'
import { Chest } from '../entities/Chest'

const GRID_LINE_COLOR = 0x2f3a2f
const GROUND_COLOR = 0x1c241c
const EXTRACTION_POINT_COLOR = 0x4a4338
const EXTRACTION_POINT_BORDER = 0xc9a35c

// The World owns the ground, the extraction point, and every spawned
// resource node, enemy, and chest. Build it once per run via build(scene).
export class World {
  constructor(config) {
    this.size = config.world.size
    this.tileSize = config.world.tileSize
    this.resourceNodeConfig = config.resourceNodes
    this.enemyConfig = config.enemies
    this.chestConfig = config.chests

    this.resourceNodes = null
    this.enemies = null
    this.chests = null
  }

  build(scene) {
    this.drawGround(scene)
    this.drawExtractionPoint(scene)
    this.resourceNodes = this.spawnResourceNodes(scene)
    this.enemies = this.spawnEnemies(scene)
    this.chests = this.spawnChests(scene)
  }

  randomPosition() {
    const margin = this.tileSize * 2
    return {
      x: Phaser.Math.Between(margin, this.size - margin),
      y: Phaser.Math.Between(margin, this.size - margin),
    }
  }

  drawGround(scene) {
    const graphics = scene.add.graphics()
    graphics.lineStyle(1, GRID_LINE_COLOR, 0.6)
    for (let x = 0; x <= this.size; x += this.tileSize) {
      graphics.lineBetween(x, 0, x, this.size)
    }
    for (let y = 0; y <= this.size; y += this.tileSize) {
      graphics.lineBetween(0, y, this.size, y)
    }

    scene.add.rectangle(this.size / 2, this.size / 2, this.size, this.size, GROUND_COLOR).setDepth(-1)
  }

  drawExtractionPoint(scene) {
    const margin = this.tileSize * 1.5
    scene.add.rectangle(margin, margin, 56, 72, EXTRACTION_POINT_COLOR).setStrokeStyle(2, EXTRACTION_POINT_BORDER)
  }

  spawnResourceNodes(scene) {
    const group = scene.add.group()
    const types = Object.keys(this.resourceNodeConfig.types)

    for (let i = 0; i < this.resourceNodeConfig.spawnCount; i++) {
      const type = Phaser.Utils.Array.GetRandom(types)
      const definition = { ...this.resourceNodeConfig.types[type], interactRange: this.resourceNodeConfig.interactRange }
      const { x, y } = this.randomPosition()
      group.add(new ResourceNode(scene, x, y, type, definition))
    }

    return group
  }

  spawnEnemies(scene) {
    const group = scene.add.group()

    for (let i = 0; i < this.enemyConfig.spawnCount; i++) {
      const { x, y } = this.randomPosition()
      group.add(new Enemy(scene, x, y, this.enemyConfig))
    }

    return group
  }

  spawnChests(scene) {
    const group = scene.add.group()

    for (let i = 0; i < this.chestConfig.spawnCount; i++) {
      const { x, y } = this.randomPosition()
      group.add(new Chest(scene, x, y, this.chestConfig))
    }

    return group
  }
}
