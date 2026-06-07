import Phaser from 'phaser'

// Single shared emitter used to pass data between Phaser scenes and Vue components.
// Phaser -> Vue: e.g. EventBus.emit('player-stats', { health, hunger, ... })
// Vue -> Phaser: e.g. EventBus.emit('hotbar-input', slotIndex)
export const EventBus = new Phaser.Events.EventEmitter()
