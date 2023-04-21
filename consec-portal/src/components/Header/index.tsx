import * as React from 'react'
import { observer } from 'mobx-react'
import { Popover } from 'antd'
import { IBase } from '@/interfaces'
import dinject from 'decorates/inject'
import { t } from '@/utils'

import AppMenu from './menu'
import './style'

interface IState {

}

@dinject('router')
// const { SubMenu } = Menu;
@observer
class Header extends React.Component<IBase, IState> {
  // wxobj: any = null
  constructor(props: any) {
    super(props)
    this.state = {

    }
  }

  /**
   * 点击logo
   */
  handlerLogoClick = () => {
    this.props.router!.push('/')
  }


  render() {
    let content = (
      <div>
        <img className="relationImg" src={require('../../assets/relation.jpg')} alt="" />
      </div>
    )
    return (
      <header className="project-header">
        <div className="project-header-container">
          <div className="project-header-container_logo">
            <img
              className="project-header-container_logo-img"
              onClick={this.handlerLogoClick}
              src={require('../../assets/logo.png')}
              alt="logo"
              title="logo" />
          </div>
          <div className="project-header-container_menu">
            <AppMenu />
          </div>
          <div className="project-header-container_relation">
            <Popover
              content={content}
              trigger="hover"
              placement="bottom"
            >
              <span>{t('联系我们')}</span>
            </Popover>
          </div>
        </div>
      </header>
    )
  }
}

export default Header
