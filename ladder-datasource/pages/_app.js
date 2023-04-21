import React, {useEffect} from 'react'
import axios from 'axios'
import Router, {useRouter} from 'next/router'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import fetch from '~/utils/fetch'
import {cookies} from '~/utils'
import '~/themes/index.less'
import {CommonLayout} from '~/components/Layout/Layout'
import Login from '~/pages/login'
import Head from 'next/head'
import {KeepAliveProvider} from 'react-next-keep-alive'

export const Context = React.createContext()

const Main = ({statusCode, Component, pageProps}) => {
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

function App({Component, pageProps, statusCode, isServer, menu}) {
  return (
    <ConfigProvider locale={zhCN}>
      <Context.Provider value={{menu}}>
        <Main {...{Component, pageProps, statusCode, isServer}} />
      </Context.Provider>
    </ConfigProvider>
  )
}

App.getInitialProps = async (appContext) => {
  const isServer = appContext.ctx.req !== undefined
  let statusCode = 0
  let pageProps = {}

  if (isServer) {
    axios.defaults.baseURL = `${appContext.ctx.req.protocol}://${appContext.ctx.req.headers.host}`

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
        data: {data, code},
      },
      {
        data: {data: userInfo},
      },
    ] = await Promise.all([
      fetch('fincloud.admin.center.facade.api.authservice.getmenulist'),
      fetch(
        'fincloud.admin.center.facade.api.authservice.querycurrentaccountinfo',
      ),
    ])
    // console.log(data)
    if (code === 0 && Array.isArray(data)) {
      menu = [...menu, ...data]
      user = userInfo
    }
    statusCode = code
  } catch (e) {
    // console.log('menu info:', e)
    menu = []
    if (!appContext.ctx.req.originalUrl.startsWith('/error') && isServer) {
      appContext.ctx.res.writeHead(307, {Location: '/error?statusCode=500'})
      appContext.ctx.res.end()
    }
  }

  if (appContext.Component.getInitialProps) {
    try {
      pageProps = await appContext.Component.getInitialProps(appContext)
    } catch (e) {
      // console.log('component getInitialProps try:', e)
      if (!pageProps.isError && isServer) {
        appContext.ctx.res.writeHead(307, {Location: '/error?statusCode=500'})
        appContext.ctx.res.end()
      }
    }
  }

  if (isServer && !pageProps.isError && !pageProps.login) {
    // console.log(pageProps)
    if (statusCode === -8) {
      appContext.ctx.res.writeHead(307, {Location: '/login'})
      appContext.ctx.res.end()
    }

    if (statusCode === -9) {
      appContext.ctx.res.writeHead(307, {Location: '/error?statusCode=500'})
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
