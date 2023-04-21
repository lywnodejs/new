// import {AbstractDisplacementState} from '@projectstorm/react-canvas-core'
import {AbstractDisplacementState} from './CustomAbstractDisplacementState'

export class DragCanvasState extends AbstractDisplacementState {
  // store this as we drag the canvas
  initialCanvasX
  initialCanvasY
  config

  constructor(options = {}) {
    super({
      name: 'drag-canvas',
    })
    this.config = {
      allowDrag: true,
      ...options,
    }
  }

  async activated(prev) {
    super.activated(prev)
    this.engine.getModel().clearSelection()
    await this.engine.repaintCanvas(true)

    // we can block layer rendering because we are only targeting the transforms
    for (let layer of this.engine.getModel().getLayers()) {
      layer.allowRepaint(false)
    }

    this.initialCanvasX = this.engine.getModel().getOffsetX()
    this.initialCanvasY = this.engine.getModel().getOffsetY()
  }

  deactivated(next) {
    super.deactivated(next)
    for (let layer of this.engine.getModel().getLayers()) {
      layer.allowRepaint(true)
    }
  }

  fireMouseMoved(event) {
    if (this.config.allowDrag) {
      this.engine
        .getModel()
        .setOffset(
          this.initialCanvasX + event.displacementX,
          this.initialCanvasY + event.displacementY,
        )
      this.engine.repaintCanvas()
    }
  }
}
