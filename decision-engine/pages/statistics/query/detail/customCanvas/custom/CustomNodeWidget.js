import * as React from 'react'
import {PortWidget} from '@projectstorm/react-diagrams-core'
import styled from '@emotion/styled'
import {FLOWCONFIG} from '~/utils/const'

export const Node = styled.div`
  width: 140px;
  /* height: 50px; */
  background-color: ${(p) => p.background};
  border-radius: 5px;
  font-family: sans-serif;
  color: white;
  border: solid 2px rgba(34, 34, 34, 0.8);
  overflow: visible;
  font-size: 11px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  border: solid 2px
    ${(p) => (p.selected ? 'rgb(0,192,255)' : 'rgba(34, 34, 34, 0.8)')} !important;
`

export default class CustomNodeWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    console.log('node-data', this.props.node.data.resultDesc)
  }

  render() {
    return (
      <Node
        onMouseLeave={this.test}
        className="custom-node"
        selected={this.props.node.isSelected()}
      >
        {/* in port */}
        {this.props.node.data.referenceType !== 0 ? (
          <PortWidget
            engine={this.props.engine}
            port={this.props.node.getPort('in')}
            className="port-container-in"
          >
            <div className="circle-port" />
          </PortWidget>
        ) : null}
        {/* out port */}
        {this.props.node.data.referenceType !== 99 ? (
          <PortWidget
            engine={this.props.engine}
            port={this.props.node.getPort('out')}
            className="port-container-out"
          >
            <div className="circle-port" />
          </PortWidget>
        ) : null}
        {/*  中间主体 */}
        <div className="custom-node-body">
          {this.props.node.data.referenceType !== 0 ? (
            <div
              style={{
                backgroundColor: this.props.node.options.color,
                padding: '3px 0',
              }}
            >
              输入
            </div>
          ) : null}
          <div
            className="custom-node-text"
            style={{color: this.props.node.options.color}}
          >
            【{this.props.node.options.name}】
            {this.props.node.data.referenceType !== 0 &&
            this.props.node.data.referenceType !== 99 ? (
              <div style={{marginTop: '5px'}}>
                {this.props.node.data.nodeName}
              </div>
            ) : null}
            {this.props.node.data.resultDesc ? (
              <div>结果：{this.props.node.data.resultDesc}</div>
            ) : null}
          </div>
          {this.props.node.data.referenceType !== 99 ? (
            <div
              style={{
                backgroundColor: this.props.node.options.color,
                padding: '3px 0',
              }}
            >
              输出
            </div>
          ) : null}
        </div>
        {/* <div style={{width: '200px', height: '200px', backgroundColor: 'red'}}>111</div> */}
      </Node>
    )
  }
}
