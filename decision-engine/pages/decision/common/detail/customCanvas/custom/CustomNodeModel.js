import {
  NodeModel,
  DefaultPortModel,
  PortModelAlignment,
} from '@projectstorm/react-diagrams'

export default class CustomNodeModel extends NodeModel {
  constructor(options) {
    super({...options, type: 'custom'})
    this.color = options.color || 'red'
    this.addPort(
      new DefaultPortModel({
        in: true,
        name: 'in',
        alignment: PortModelAlignment.TOP,
      }),
    )
    this.addPort(
      new DefaultPortModel({
        in: false,
        name: 'out',
        alignment: PortModelAlignment.BOTTOM,
      }),
    )
  }
  serialize() {
    return {
      ...super.serialize(),
      color: this.color,
    }
  }

  deserialize(event) {
    super.deserialize(event)
    this.color = event.data.color
  }
}
