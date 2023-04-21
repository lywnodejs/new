import * as React from 'react'
import { observer } from 'mobx-react'

import './style'
import './quill.snow'
import './quill.core'
import './quill.bubble'

interface IProps {
  content: any
}
interface IState {
  content: any,
}
@observer
class AppsContent extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      content: '',
    }
  }
  

  componentDidMount() {
  }

  render() {
    return (
      <div className="privacy-treeContent">
        <div className="privacy-treeContent-container ql-container ql-snow">
          <div className="privacy-treeContent-container__right-noTree ql-editor" dangerouslySetInnerHTML={{__html: this.props.content}}>

          </div>
        </div>
      </div>
    )
  }
}

export default AppsContent
