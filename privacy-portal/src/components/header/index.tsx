import * as React from 'react'
import { observer } from 'mobx-react'
import { Carousel } from 'antd'
// import {observable} from 'mobx'

import dinject from 'decorates/inject'
import { IUserModel, ICarouselModel, IBase} from 'interfaces'

import './style'

interface IState {
  menuList: any // 首页菜单列表
  activeMenuClass: string // 激活菜单class
  isHome: boolean
  carouselList: any
  lang: any
  lastMenu: any
}
// const { Option } = Select
// let language = observable({
//   lang: 'zh_CN'
// })

@dinject('user','carousel','app')
@observer
class Header extends React.Component<IBase & IUserModel & ICarouselModel , IState> {
  // wxobj: any = null
  constructor(props: any) {
    super(props)
    this.state = {
      lang: 'zh_CN',
      isHome: true,
      menuList: [
        {
          url: '/',
          name: '首页',
          active: true
        },
        {
          name: '隐私政策总则',
          url: '/generalPolicy',
          active: false
        },
        {
          url: '/policy',
          name: '隐私政策',
          active: false
        },
        {
          url: '/operationGuide',
          name: '操作指引',
          active: false
        }
        // {
        //   name: 'DDCTF',
        //   url: 'https://ddctf.didichuxing.com/',
        //   active: false
        // },
        // {
        //   url: '/loophole',
        //   name: '提交漏洞',
        //   active: false
        // },
        // {
        //   url: '/present',
        //   name: '积分商城',
        //   active: false
        // },
        // {
        //   url: '/rank',
        //   name: '荣誉榜',
        //   active: false
        // },
        // {
        //   url: '/notice',
        //   name: '公告',
        //   active: false
        // }
      ],
      activeMenuClass: 'privacy-header__tabBar--active',
      carouselList: [],
      lastMenu: false
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
    this.setState({
      lang: this.props.app!.language,
      lastMenu: true
    })

    
    let a = this.props.carousel!.getCarouselList()
    a.then((res) => {
      this.setState({
        carouselList: res
      })
    })


    // this.props.user!.getUserInfo()
    let currentPath = this.props.router!.history.location.pathname
    this.setActiveMenu(currentPath)

    if (this.props.router!.location.pathname !== '/') {
      this.setState({
        isHome: false
      })
    }

    this.props.router!.history.listen(route => {
      if (route.pathname === '/') {
        this.setState({
          isHome: true
        })
      } else {
        this.setState({
          isHome: false
        })
      }
    })
  }

  /**
   * 设置激活菜单
   * @param url 要设置激活菜单的URL
   */
  setActiveMenu(url: string) {
    let menus = this.state.menuList
    this.state.menuList.forEach((item, index) => {
      menus[index].active = false
      if (item.url == url) {
        menus[index].active = true
      }
    })
    this.setState({
      menuList: menus
    })
  }


  

  /**
   * 点击菜单
   */
  handlerMenuClick = menu => {
    if (menu.name !== 'DDCTF') {
      this.props.router!.history.push(menu.url)
      this.setActiveMenu(menu.url)
    }
    this.setState({
      lastMenu: true
    })
    // setTimeout(() => {
    // if(this.state.lastMenu == true && document.documentElement.scrollTop !== 498){
      // const time = setInterval(function () {
      //   document.documentElement.scrollTop = document.documentElement.scrollTop + 6
      //   if (document.documentElement.scrollTop >= 498) {
      //       clearInterval(time)
      //   }
      // }, 1)
      setTimeout(() => {

        window.scrollTo(0, 498)
      },100)
    // }
    // }, 1000)
    

  }

  /**
   * 点击logo
   */
  handlerLogoClick = () => {
    this.props.router!.history.push('/')
  }

  handleChange = (value) =>{
    if(value == 'zh_CN'){
      this.props.app!.languageToZh()
      this.setState({
        menuList: [
          {
            url: '/',
            name: '首页',
            active: true
          },
          {
            name: '隐私政策总则',
            url: '/generalPolicy',
            active: false
          },
          {
            url: '/policy',
            name: '隐私政策',
            active: false
          },
          {
            url: '/operationGuide',
            name: '操作指引',
            active: false
          }
        ]
      })
    }else if(value = 'en_US'){
      this.props.app!.languageToEn()
      this.setState({
        menuList: [
          {
            url: '/',
            name: 'Hmoe',
            active: true
          },
          {
            name: 'General privacy policy ',
            url: '/generalPolicy',
            active: false
          },
          {
            url: '/policy',
            name: 'Privacy Policy',
            active: false
          },
          {
            url: '/operationGuide',
            name: 'Operation guidelines',
            active: false
          }
        ]
      })
    }
  }

  handleScroll =(e)=>{
    const header = document.getElementById('tabBar') // 定义一个dom节点为'header'的header变量
    if(window.pageYOffset >= 498 && header){  // if语句判断window页面y方向的位移是否大于或者等于导航栏的height像素值
      header!.classList.add('privacy-header-tabBar__scroll')  // 当y方向位移大于498px时，定义的变量增加一个新的样式
    } else {
      header!.classList.remove('privacy-header-tabBar__scroll') // 否则就移除样式
    }
  }

  render() {
    const style = {
      height: '580px'
    }
    return ( 
      <header className={"privacy-header"}>
        <div className="privacy-header-container">
          <ul>
            <li className="privacy-header__nav privacy-header__nav--logo" onClick={this.handlerLogoClick}>
              <img src={require('../../assets/didichuxingLogo.png')} />
              <div className="right">
                <p className="top">隐私保护平台</p>
                <p className="bottom">让出行更美好</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="language">
        {/* <Select defaultValue="中文" style={{ width: 120 }} onChange={this.handleChange}>
          <Option value="zh_CN" >中文</Option>
          <Option value="en_US">English</Option>
        </Select> */}
        </div>
        <div className="privacy-header-carousel-container">
          {this.state.carouselList.length > 0 ? 
          <Carousel autoplay={true} autoplaySpeed={5000}>
            {this.state.carouselList.length > 0 && this.state.carouselList && this.state.carouselList.map((item, index) => {
              return (
                <div key={index} className="privacy__carousel__item" style={style}>
                  <a>
                    <img
                      height="580px"
                      src={item.imgUrl}
                    />
                  </a>
                </div>
              )
            })}
          </Carousel> :''
        }
          
        </div>
        <div id="tabBar" className="privacy-header-tabBar">
          <ul>
            {this.state.menuList.map(item => {
              return (
                <li
                  key={item.url}
                  className={
                  item.url == this.props.router!.location.pathname
                  ? this.state.activeMenuClass +
                    ' privacy-header__tabBar  privacy-header__tabBar--home'
                  : ' privacy-header__tabBar  privacy-header__tabBar--home'}
                  onClick={this.handlerMenuClick.bind(this, item)}
                >
                  {item.name == 'DDCTF' ? (
                    <a target="_blank" href={item.url}>
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </header>
    )
  }
}

export default Header
