import * as React from 'react'
import classNames from 'classnames'

import './style.less'

function normalize(value, count) {
  if (value.slice(-2) == 'px') {
    return value.slice(0, -2) / count + 'px'
  } else if(value.slice(-1) == '%') {
    return value.slice(0, -1) / count + '%'
  }
  return value / count
}

export default class Skeleton extends React.Component {
  static defaultProps = {
    count: 1,
    width: null,
    height: null,
    float: 'none',
    padding: false
  }

  render() {
    const elements = []
    const style = {}
    const className = classNames({
      'upm-skeleton-container': true,
      'upm-skeleton-container--right': this.props.float === 'right',
      'upm-skeleton-container--left': this.props.float === 'left',
      'upm-padding--top': this.props.padding
    })

    for (let i = 0; i < this.props.count; i++) {
      if (this.props.width != null) {
        style.width = this.props.width
      }
      if (this.props.height != null) {
        style.height = normalize(this.props.height, this.props.count)
      }

      elements.push(
        <div className={className} style={style} key={i}>
          <span key={i} className='upm-skeleton'>
            &zwnj;
          </span>
        </div>
      )
    }

    return <React.Fragment>{elements}</React.Fragment>
  }
}
