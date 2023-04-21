import React, {useContext} from 'react'
import {PortWidget} from '@projectstorm/react-diagrams-core'
import styled from '@emotion/styled'
import {FLOWCONFIG} from '~/utils/const'
import {ThemeContext} from '../RuleFlowTableList'

export const Node = styled.div`
  /* width: 140px; */
  width: ${(p) => (p.type === 0 || p.type === 99 ? '70px' : '140px')};
  /* height: 50px; */
  background-color: ${(p) => p.background};
  border-radius: 6px;
  font-family: sans-serif;
  color: white;
  border: solid 2px rgba(34,34, 34, 0.4);
  box-shadow: 0 1px 4px rgba(211, 211, 236, 0.2);
  overflow: visible;
  font-size: 11px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  /* border: solid 2px
    ${(p) =>
      p.selected ? 'rgb(0,192,255)' : 'rgba(34, 34, 34, 0.8)'} !important; */
`

const FlowNumber = ({children}) => {
  const partialPro = useContext(ThemeContext)
  // console.log('partialPro', partialPro)
  return (
    <>
      {partialPro ? (
        <div style={{textAlign: 'center', fontSize: '12px'}}>{children}</div>
      ) : null}
    </>
  )
}

export default class CustomNodeWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    // console.log('node-data', this.props.node.data)
  }

  render() {
    return (
      <Node
        onMouseLeave={this.test}
        className="custom-node"
        selected={this.props.node.isSelected()}
        type={this.props.node.data.referenceType}
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
            {this.props.node.data.referenceType !== 0 &&
            this.props.node.data.referenceType !== 99 &&
            this.props.node.data.type !== 'REF' ? (
              <FlowNumber>
                {this.props.node.data.referenceCount
                  ? `人数: ${this.props.node.data.referenceCount}`
                  : '人数: 0'}
              </FlowNumber>
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
      </Node>
    )
  }
}
