import Phaser from 'phaser'

// No external assets yet — placeholder scene kept for future asset loading.
export class Boot extends Phaser.Scene {
  constructor() {
    super('Boot')
  }

  create() {
    this.scene.start('MainGame')
  }
}
