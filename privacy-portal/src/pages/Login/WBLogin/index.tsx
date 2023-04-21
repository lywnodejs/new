import * as React from 'react'
import { observer } from 'mobx-react'
import dinject from 'decorates/inject'
import { IUserModel } from '../../../interfaces'
import { parseQueryString } from '../../..//utils'
import { message, Spin, Icon } from 'antd'

@dinject('router', 'user')
@observer
class WBLogin extends React.Component<IUserModel, {}> {
  componentDidMount() {
    let search = this.props.router!.location.search
    let params: any = parseQueryString(search)
    this.props.user!.WBLogin(search).then(res => {
      if (this.props.user!.WBLoginInfo.errno == 0) {
        this.props.app!.changeLoginSessionId(this.props.user!.WBLoginInfo.data)
        this.setCookie('userSessionId', this.props.user!.WBLoginInfo.data)
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
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />

    return (
      <div>
        <Spin indicator={antIcon} />
      </div>
    )
  }

}

export default WBLogin
