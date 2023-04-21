import * as React from 'react'
import { Menu } from 'antd'
import { inject } from 'mobx-react'
// import { t } from '@/utils'
import './style'

interface IState {
  current: string //当前菜单选中项
  openKeys: any // 当前展开的菜单项
  defaultOpenKeys: any // 默认的展开项
}

interface IProps {
  navList: any, // 菜单数据
  router: any // router
}

@inject('router')

class Childmenu extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      current: '/',
      openKeys: [],
      defaultOpenKeys: []
    }

  }

  componentDidMount() {
    // 初始化选中菜单
    this.setState({
      current: this.props.router!.location.pathname
    })
    if (this.props.router!.location.pathname.indexOf('help/interface') !== -1) {
      this.setState({
        openKeys: ['/help/interface']
      })
    }
    // 监听路由变化
    this.props.router!.history.listen(route => {
      let current = route.pathname;
      this.setState({
        current: route.pathname
      })

      if (current.indexOf('help/interface') !== -1) {
        this.setState({
          openKeys: ['/help/interface']
        })
      }
      window.scrollTo({
        top: 0
      })
    })
    window.addEventListener('scroll', this.handleScroll)
  }

  /**
   * 监听滚动
   */
  handleScroll: any = () => {
    let element: any = document.getElementById('capacity-nav')
    let footerOffset: any = document.getElementsByClassName('project-footer')[0].getBoundingClientRect().top
    let contentOffset: any;
    if (document.getElementsByClassName('right-content').length > 0) {
      contentOffset = document.getElementsByClassName('right-content')[0].getBoundingClientRect().left
    }
    /**
     * 当footer的offsetTop高度 < menus的高度 + header + margin40,那么说明当前footer和菜单重叠了需要去掉固定定位(y轴判定)
     * 当左侧试图区域的offsetLeft的长度 < menus的宽度，那么说明当前右侧视图和菜单的X轴重叠了需要去掉固定定位(X轴判定)
     */
    if (element) {
      if (element.clientHeight + 80 + 40 > footerOffset || element.clientWidth + 50 > contentOffset) {
        element.style.position = 'static'
      } else {
        element.style.position = 'fixed'
      }
    }

  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll())
  }

  // 左侧菜单的点击跳转
  handleClick: any = e => {
    this.props.router.push(e.key);
    this.setState({
      current: e.key,
    })
  }
  openChange = (openKeys) => {
    this.setState({
      openKeys
    })
  }

  render() {
    // const pathname = this.props.router.location.pathname
    const { navList } = this.props
    const { current, openKeys } = this.state
    // const defaultOpenKeys = pathname.indexOf('/help/interface') !== -1 ? '/help/interface' : ''
    return (
      <div className="project-childmenu-nav" id="capacity-nav">
        <Menu
          className="childrenMenus"
          onClick={this.handleClick}
          mode="inline"
          style={{ position: 'static' }}
          selectedKeys={[current]}
          // defaultOpenKeys={[defaultOpenKeys]}
          openKeys={openKeys}
          onOpenChange={this.openChange}
        >
          {
            navList.map(item => {
              return (
                !item.children ?
                  <Menu.Item key={item.url} disabled={item.undone}>
                    <i className="icon_left"><img src={item.icon} alt="" /></i>
                    {item.name}
                  </Menu.Item>
                  :
                  <Menu.SubMenu
                    key={item.url}
                    title={
                      <span>
                        <i className="icon_left"><img src={item.icon} alt="" /></i>
                        {item.name}
                      </span>
                    }
                  >
                    {
                      item.children.map(itemB => {
                        return (
                          <Menu.Item key={itemB.url}>
                            &nbsp;&nbsp;{itemB.name}
                          </Menu.Item>
                        )
                      })
                    }
                  </Menu.SubMenu>
              )

            })
          }
        </Menu >
      </div >
    )
  }
}

export default Childmenu
