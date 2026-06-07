import Phaser from 'phaser'
import { Boot } from './scenes/Boot'
import { MainGame } from './scenes/MainGame'

export function createGame(parent) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 960,
    height: 600,
    backgroundColor: '#1c241c',
    physics: {
      default: 'arcade',
      arcade: { debug: false },
    },
    scene: [Boot, MainGame],
  })
}
