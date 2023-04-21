import React from 'react'

import './style'

interface IProps {
  hint: String
}

class HeadHint extends React.Component<IProps, {}> {
  render() {
    return (
      <div className="dsrc-header-hint">
          {this.props.hint}
      </div>
    )
  }
}

export default HeadHint
