import {State, StateOptions} from '@projectstorm/react-canvas-core'
import {Action, ActionEvent, InputType} from '@projectstorm/react-canvas-core'
import {CanvasEngine} from '@projectstorm/react-canvas-core'

export class AbstractDisplacementState extends State {
  initialX
  initialY
  initialXRelative
  initialYRelative

  constructor(options) {
    super(options)
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: (actionEvent) => {
          this.initialX = actionEvent.event.clientX
          this.initialY = actionEvent.event.clientY
          const rel = this.engine.getRelativePoint(
            actionEvent.event.clientX,
            actionEvent.event.clientY,
          )
          this.initialXRelative = rel.x
          this.initialYRelative = rel.y
        },
      }),
    )
    this.registerAction(
      new Action({
        type: InputType.MOUSE_MOVE,
        fire: (actionEvent) => {
          const {event} = actionEvent

          if (event.buttons === 0) {
            // If buttons is 0, it means the mouse is not down, the user may have released it
            // outside of the canvas, then we eject the state
            this.eject()

            return
          }
          this.fireMouseMoved({
            displacementX: event.clientX - this.initialX,
            displacementY: event.clientY - this.initialY,
            virtualDisplacementX:
              (event.clientX - this.initialX) /
              (this.engine.getModel().getZoomLevel() / 100.0),
            virtualDisplacementY:
              (event.clientY - this.initialY) /
              (this.engine.getModel().getZoomLevel() / 100.0),
            event: event,
          })
        },
      }),
    )
    this.registerAction(
      new Action({
        type: InputType.MOUSE_UP,
        fire: (event) => {
          // when the mouse if up, we eject this state
          console.log('触发了 Up')
          this.eject()
        },
      }),
    )
    // fireMouseMoved(event)
  }
}
