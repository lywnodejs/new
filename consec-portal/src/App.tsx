import * as React from 'react'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { LocaleProvider } from 'antd'
import { observer, inject } from 'mobx-react'

import Header from './components/Header'
import Footer from './components/Footer'
import { IHomePage } from 'interfaces'
import { Di18nProvider } from 'di18n-react'
import Di18enUS from './di18/en-US.json'
import Di18zhCN from './di18/zh-CN.json'
import './style/reset.less'


interface IState {

}

// di18语言包
const locales = {
  'en-US': Di18enUS,
  'zh-CN': Di18zhCN,
}

@inject('home')

@observer class App extends React.Component<IHomePage, IState> {
  renderDevTool() {
    if (process.env.NODE_ENV !== 'production') {
      const DevTools = require('mobx-react-devtools').default
      return <DevTools />
    }
    return null
  }

  constructor(props: any) {
    super(props)
    this.state = {}

  }
  componentDidMount() {
    this.props!.home!.getIndexxmg()
  }


  render() {
    return (
      <Di18nProvider locales={locales}>
        <LocaleProvider locale={zhCN}>
          <div>
            <Header />
            {this.props.children}
            <Footer />
            {/* {this.renderDevTool()} */}
          </div>
        </LocaleProvider>
      </Di18nProvider>
    )
  }
}

export default App
