// A second camera that renders a zoomed-out view of the world in a corner
// of the screen, framed by a border rectangle.
export class Minimap {
  constructor(scene, definition, worldSize) {
    this.scene = scene
    this.size = definition.size
    this.padding = definition.padding
    this.backgroundColor = definition.backgroundColor
    this.borderColor = definition.borderColor
    this.worldSize = worldSize
  }

  setup() {
    const { scene, size, padding } = this

    this.camera = scene.cameras
      .add(0, 0, size, size)
      .setZoom(size / this.worldSize)
      .setName('minimap')
      .setBackgroundColor(this.backgroundColor)

    this.camera.scrollX = 0
    this.camera.scrollY = 0

    const border = scene.add
      .rectangle(0, 0, size, size)
      .setStrokeStyle(2, this.borderColor)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(1000)

    this.camera.ignore(border)

    const reposition = () => {
      const { width } = scene.scale
      this.camera.setViewport(width - size - padding, padding, size, size)
      border.setPosition(width - size - padding, padding)
    }

    reposition()
    scene.scale.on('resize', reposition)
  }
}
