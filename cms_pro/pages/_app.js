import React from 'react'
import axios from 'axios'
import Router, {useRouter} from 'next/router'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import fetch from '~/utils/fetch'
import {cookies} from '~/utils'
import {apiUrl} from '~/utils/config'
import '~/themes/index.less'
import {CommonLayout} from '~/components/Layout/Layout'
import Login from '~/pages/login'
import ScrollTop from '../components/ScrollTop'
export const Context = React.createContext()

import {KeepAliveProvider} from 'react-next-keep-alive'

const Main = ({statusCode, Component, pageProps}) => {
  // console.log(statusCode, isServer, '--------------------')
  const router = useRouter()
  if (pageProps.login || pageProps.isError) {
    return <Component {...pageProps} />
  }

  return (
    <CommonLayout>
      <KeepAliveProvider router={router}>
        <Component {...pageProps} />
      </KeepAliveProvider>
    </CommonLayout>
  )
}

function App({Component, pageProps, statusCode, isServer, menu, user}) {
  return (
    <ConfigProvider locale={zhCN}>
      <Context.Provider value={{menu, user}}>
        <ScrollTop>
          <Main {...{Component, pageProps, statusCode, isServer}} />
        </ScrollTop>
        <script src="/js/echarts.min.js"></script>
        <script type="text/javascript" src="/js/map/china.js"></script>
      </Context.Provider>
    </ConfigProvider>
  )
}

App.getInitialProps = async (appContext) => {
  let statusCode = 0
  let pageProps = {}
  const isServer = appContext.ctx.req !== undefined

  if (isServer) {
    axios.defaults.baseURL = `${appContext.ctx.req.protocol}://${appContext.ctx.req.headers.host}`
    // axios.defaults.baseURL = apiUrl

    delete axios.defaults.headers.common['sessionid']

    if (appContext.ctx.req.headers && appContext.ctx.req.headers.cookie) {
      // console.log('server:', appContext.ctx.req.headers.cookie)
      const cookie = appContext.ctx.req.headers.cookie.replace(
        'sessionId=undefined;',
        '',
      )
      const {sessionId} = cookies(cookie)

      // console.log('sessionId: ', sessionId)
      if (sessionId !== undefined && sessionId !== 'undefined') {
        axios.defaults.headers.common['sessionid'] = sessionId
      }
    }
  }

  // let {menu} = await import('~/lib/menu')
  let menu = []
  let user = {}
  try {
    const [
      {
        data: {code, data},
      },
      {
        data: {data: userInfo},
      },
    ] = await Promise.all([
      fetch('bank.api.privilegemanageservice.queryprivilegemanagelist'),
      fetch('bank.api.accountservice.querycurrentaccountinfo'),
    ])

    if (code === 0 && Array.isArray(data)) {
      menu = data
      user = userInfo
    }
    statusCode = code
  } catch (e) {
    menu = []

    if (isServer && !appContext.ctx.req.originalUrl.startsWith('/error')) {
      appContext.ctx.res.writeHead(307, {Location: '/error?statusCode=500'})
      appContext.ctx.res.end()
    }
  }

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext)
  }

  if (
    isServer &&
    (statusCode === -8 || statusCode === 1) &&
    !pageProps.isError
  ) {
    // console.log(pageProps)
    if (appContext.ctx.req.originalUrl !== '/login') {
      appContext.ctx.res.writeHead(307, {Location: '/login'})
      appContext.ctx.res.end()
    }
  }

  return {
    pageProps,
    menu,
    user,
    statusCode,
  }
}

export default App
