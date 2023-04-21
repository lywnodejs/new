import * as React from 'react'
import classNames from 'classnames'

import './style'

interface IProps {
  count?: number
  width?: number | string | null
  height?: number | string | null
  float?: string | null
}

export default class Skeleton extends React.Component<IProps> {
  static defaultProps: IProps = {
    count: 1,
    width: null,
    height: null,
    float: 'none'
  }

  render() {
    const elements: Array<any> = []
    const style: any = {}
    const className = classNames({
      'dsrc-skeleton': true,
      'dsrc-skeleton--right': this.props.float === 'right',
      'dsrc-skeleton--left': this.props.float === 'left'
    })

    for (let i = 0; i < this.props.count!; i++) {
      if (this.props.width != null) {
        style.width = this.props.width
      }
      if (this.props.height != null) {
        style.height = this.props.height
      }

      elements.push(
        <span key={i} className={className} style={style}>
          &zwnj;
        </span>
      )
    }

    return <React.Fragment>{elements}</React.Fragment>
  }
}
