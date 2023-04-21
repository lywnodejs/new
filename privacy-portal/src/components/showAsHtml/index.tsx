import React from 'react'

interface IProps {
  content: any
}

class ShowAsHtml extends React.Component<IProps, {}> {
  showAsHtml(content: string) {
    return { __html: content }
  }

  render() {
    return (
      <div dangerouslySetInnerHTML={this.showAsHtml(this.props.content || '')}>
      </div>
    )
  }
}

export default ShowAsHtml
