import * as React from 'react'
import './style/reset.less'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { LocaleProvider } from 'antd'

import Header from './components/header'
import Footer from './components/footer'
import { observer, inject } from 'mobx-react'
import { IBase } from 'interfaces'
// import { lang } from 'moment'

interface IState {
  isHome: boolean
}

@inject('router', 'carousel')
@observer
class App extends React.Component<IBase, IState> {
  renderDevTool() {
    if (process.env.NODE_ENV !== 'production') {
      const DevTools = require('mobx-react-devtools').default
      return <DevTools />
    }
    return null
  }

  constructor(props: any) {
    super(props)
    this.state = {
      isHome: true
    }
  }

  componentDidMount() {
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

  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <div
          className={
            'dsrc-main dsrc-main--padding'
          }
        >
          <div className="dsrc-layout__header">
            <Header />
          </div>
          {this.props.children}
          <Footer />
          {/* <div
            className={
              'dsrc-layout__container  dsrc-overflow-container'
            }
          >
            <div className="dsrc-layout__container__main">
              
            </div>
          </div> */}
          {this.renderDevTool()}
        </div>
      </LocaleProvider>
    )
  }
}

export default App
