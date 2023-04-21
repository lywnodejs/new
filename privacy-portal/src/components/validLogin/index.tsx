import React, { Component } from 'react'
import { observer } from 'mobx-react'
import './style'

import dinject from 'decorates/inject'
import { IUserModel } from 'interfaces'

interface IState {
  loading: boolean
}

/**
 * 用于登录校验的高阶组件
 */
export default (Skeleton?) => WrappedComponent => {
  @dinject('user')
  @observer
  class NewComponent extends Component<IUserModel, IState> {
    constructor(props: any) {
      super(props)
      this.state = {
        loading: true
      }
    }

    componentDidMount() {
      // 获取用户登录信息
      this.props.user!.getUserInfo().then(res => {
        this.setState({
          loading: false
        })
        if (!this.props.user!.isLogin) {
          // 未登录，显示登录框
          this.props.app!.toggleLogin()
        } else if(this.props.user!.ejectUserInfo == 2) {
          this.props.app!.toggleUserInfoModal()
        }
      })
    }

    showLogin = () => {
      this.props.app!.toggleLogin()
    }

    render() {
      if (this.state.loading) return Skeleton ? <Skeleton /> : null
      if (this.props.user!.isLogin) {
        // 登录之后正常显示组件
        return <WrappedComponent />
      } else {
        // 未登录状态
        return (
          <div className="dsrc-no-permission">
            <h2 className="dsrc-hint">
              请先<a onClick={this.showLogin}>登录</a>，否则没有权限查看哦！
            </h2>
          </div>
        )
      }
    }
  }
  return NewComponent
}
