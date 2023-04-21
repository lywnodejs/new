import * as React from 'react'

import './style'
interface IProps {
  tabData: any // tab数据
  style: any // tab头部样式
}

interface IState {
  tabIndex: Number
}

class TabMenus extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props)
    this.state = {
      tabIndex: 0
    }
  }

  // tab切换点击
  tabClick = (index) => {
    this.setState({
      tabIndex: index,
    })
  }


  render() {
    const { tabIndex } = this.state
    const { tabData, style } = this.props
    return (
      <div>
        <div className="capacity-tab">
          {
            tabData.map((item, index) => {
              return (
                <span
                  onClick={() => this.tabClick(index)}
                  key={item.name}
                  style={style}
                  className={tabIndex === index ? 'capacity-tab--active' : ''}
                >
                  {item.name}
                </span>
              )
            })
          }
        </div>
        <div className="capacity-tabImg">
          {
            tabData.map((item, index) => {
              return (
                <img
                  key={item.name}
                  className={tabIndex === index ? 'capacity-tabImg--active' : ''}
                  src={item.img}
                />
              )
            })
          }
        </div>
      </div>
    )
    // const tabClick = this.tabClick;
  }
}

export default TabMenus
