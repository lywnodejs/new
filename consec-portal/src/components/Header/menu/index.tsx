import * as React from 'react'
import { Menu } from 'antd'
import { observer } from 'mobx-react'
import dinject from 'decorates/inject'
import { IBase } from '@/interfaces'

const { SubMenu } = Menu


interface Istate {
  current: string
}

@dinject('router', 'app')

@observer
class AppMenu extends React.Component<IBase, Istate> {
  constructor(props: any) {
    super(props)
    this.state = {
      current: '/', // 当前菜单状态
    }
  }

  componentDidMount() {

    // 初始化选中菜单
    this.setState({
      current: this.props.router!.location.pathname
    })

    // 监听路由变化
    this.props.router!.history.listen(route => {
      let pathname = route.pathname;
      if (pathname === '/help/interface') {
        pathname = '/help/interface/machine'
        this.props.router!.push('/help/interface/machine')
      }
      this.setState({
        current: pathname
      })
      window.scrollTo({
        top: 0
      })
    })
  }



  // 点击菜单跳转
  handleClick = e => {
    this.setState({
      current: e.key,
    })
    this.props.router!.push(e.key)
  }

  render() {
    const { menus } = this.props.app!
    const { current } = this.state
    return (
      <Menu
        onClick={this.handleClick}
        className="menus"
        mode="horizontal"
        selectedKeys={[current]}
      >
        {
          menus.map(item => {
            return (
              <SubMenu
                className="submenuPop"
                key={item.url}
                title={<span>{item.title}</span>}
              >
                {
                  item.list.map(itemB => {
                    return (
                      !itemB.children ?
                        <Menu.Item key={itemB.url} disabled={itemB.undone}>{itemB.text}</Menu.Item>
                        :
                        <SubMenu
                          key={itemB.url}
                          title={<span>{itemB.text}</span>}
                        >
                          {
                            itemB.children.map(child => {
                              return (
                                <Menu.Item key={child.url}>{child.text}</Menu.Item>
                              )
                            })
                          }
                        </SubMenu>
                    )
                  })
                }
              </SubMenu>
            )

          })
        }
      </Menu>
    )
  }
}

export default AppMenu
