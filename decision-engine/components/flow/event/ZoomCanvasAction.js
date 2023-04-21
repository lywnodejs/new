import {WheelEvent} from 'react'
import {Action, ActionEvent, InputType} from '@projectstorm/react-canvas-core'

export class ZoomCanvasAction extends Action {
  constructor(options = {}) {
    super({
      type: InputType.MOUSE_WHEEL,
      fire: (actionEvent) => {
        const {event} = actionEvent
        const model = this.engine.getModel()
        this.initialCanvasX = this.engine.getModel().getOffsetX()
        this.initialCanvasY = this.engine.getModel().getOffsetY()
        model.setOffset(
          this.initialCanvasX - event.deltaX,
          this.initialCanvasY - event.deltaY,
        )
        this.engine.repaintCanvas()
      },
    })
  }
}
