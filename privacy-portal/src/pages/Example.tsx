import * as React from 'react'
import { observer, inject } from 'mobx-react'

import { IExample } from '../interfaces'

interface IState {
  renderList: any
}

@inject('user')
@observer
class Example extends React.Component<IExample, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      renderList: []
    }
  }
  componentDidMount() {
    let params = {
      name: 'a',
      age: 1
    }
    this.props.example.getExampleList(params).then(res => {
      this.setState({
        renderList: this.props.example.exampleList
      })
    })
  }

  render() {
    return (
      <div>
        {this.state.renderList.map((user) => {
          return (
            <div key={user.id}>name: {user.name}, email: {user.email}</div>
          )
        })}
      </div>
    )
  }
}

export default Example
