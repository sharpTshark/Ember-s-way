import { EventBus } from '../EventBus'

// Counts down the run timer and reports it to Vue through the EventBus.
export class ExtractionTimer {
  constructor(scene, definition) {
    this.scene = scene
    this.remaining = definition.durationSeconds
    this.destination = definition.destination
  }

  start() {
    this.emitProgress()
    this.timer = this.scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.remaining = Math.max(0, this.remaining - 1)
        this.emitProgress()
      },
    })
  }

  emitProgress() {
    EventBus.emit('extraction-timer', { remaining: this.remaining, destination: this.destination })
  }
}
