import * as React from 'react'
import { observer } from 'mobx-react'
import dinject from 'decorates/inject'
import { IUserModel } from '../../../interfaces'
import { message } from 'antd'
import { parseQueryString } from '../../..//utils'

@dinject('router', 'user')
@observer
class WXLogin extends React.Component<IUserModel, {}> {
  componentDidMount() {
    let search = this.props.router!.location.search
    let params: any = parseQueryString(search)
    this.props.user!.WXLogin(search).then(res => {
      if (this.props.user!.WXLoginInfo.errno == 0) {
        this.props.app!.changeLoginSessionId(this.props.user!.WXLoginInfo.data)
        // document.cookie = name + "=" + escape(this.props.user!.WXLoginInfo.data)
        this.setCookie('userSessionId', this.props.user!.WXLoginInfo.data)

        // 登录成功，获取用户信息
        this.props.user!.getUserInfo().then(res => {
          if(this.props.user!.ejectUserInfo == 2) {
            this.props.app!.toggleUserInfoModal()
          }
        })
      } else {
        message.error('登录失败')
      }
      this.props.router!.push(params.path)
    })
  }

  setCookie = (name, value) => {
    document.cookie = name + "=" + escape(value) + ";path=/"
  }

  render() {
    return <div />
  }
}

export default WXLogin
