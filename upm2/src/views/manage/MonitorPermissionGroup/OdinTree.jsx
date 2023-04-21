import React, { Component } from 'react'
import TreeSelect from './TreeSelect';

export default class OdinTree extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.value !== this.props.value) return true;
    return false;
  }
  render() {
    return (
      <TreeSelect {...this.props}>
        {this.props.children}
      </TreeSelect>
    )
  }
}
