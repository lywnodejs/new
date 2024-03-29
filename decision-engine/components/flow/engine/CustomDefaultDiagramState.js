import {MouseEvent} from 'react'
import {
  SelectingState,
  State,
  Action,
  InputType,
  //   DragCanvasState,
} from '@projectstorm/react-canvas-core'
import {DragCanvasState} from './CustomDragCanvasState'
import {PortModel} from '@projectstorm/react-diagrams-core'
import {DragNewLinkState} from '@projectstorm/react-diagrams-core'
import {DragDiagramItemsState} from '@projectstorm/react-diagrams-core'

export class DefaultDiagramState extends State {
  dragCanvas
  dragNewLink
  dragItems

  constructor() {
    super({
      name: 'default-diagrams',
    })
    this.childStates = [new SelectingState()]
    this.dragCanvas = new DragCanvasState()
    this.dragNewLink = new DragNewLinkState()
    this.dragItems = new DragDiagramItemsState()

    // determine what was clicked on
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        fire: (event) => {
          const element = this.engine
            .getActionEventBus()
            .getModelForEvent(event)

          // the canvas was clicked on, transition to the dragging canvas state
          if (!element) {
            this.transitionWithEvent(this.dragCanvas, event)
          }
          // initiate dragging a new link
          else if (element instanceof PortModel) {
            this.transitionWithEvent(this.dragNewLink, event)
          }
          // move the items (and potentially link points)
          else {
            this.transitionWithEvent(this.dragItems, event)
          }
        },
      }),
    )
  }
}
