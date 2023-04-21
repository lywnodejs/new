import React from 'react'
import {AbstractReactFactory} from '@projectstorm/react-canvas-core'
import CustomNodeModel from './CustomNodeModel'
import CustomNodeWidget from './CustomNodeWidget'

export default class CustomNodeFactory extends AbstractReactFactory {
  constructor() {
    super('custom')
  }
  generateModel() {
    return new CustomNodeModel()
  }
  generateReactWidget(event) {
    return <CustomNodeWidget engine={this.engine} node={event.model} />
  }
}
