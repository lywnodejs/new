import React from 'react'
import axios from 'axios'
import {ConfigProvider} from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import api from '~/api/product'
import {cookies} from '~/utils'
import '~/themes/index.less'
import {CommonLayout} from '~/components/Layout/Layout'
import Login from '~/pages/login'
import {KeepAliveProvider} from 'react-next-keep-alive'
import {useRouter} from 'next/router'

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
  let statusCode = 0
  const isServer = appContext.ctx.req !== undefined

  if (isServer) {
    axios.defaults.baseURL = `${appContext.ctx.req.protocol}://${appContext.ctx.req.headers.host}`

    if (appContext.ctx.req.headers && appContext.ctx.req.headers.cookie) {
      // console.log('server:', appContext.ctx.req.headers.cookie)
      const cookie = appContext.ctx.req.headers.cookie.replace(
        'sessionId=undefined;',
        '',
      )

      const {sessionId} = cookies(cookie)

      delete axios.defaults.headers.common['token']

      if (sessionId !== undefined && sessionId !== 'undefined') {
        axios.defaults.headers.common['token'] = sessionId
      }
    }
  }

  let pageProps = {}
  let {menu} = await import('~/lib/menu')
  // let menu = []
  // try {
  //   // throw new Error({msg: 'test'})
  //   const {
  //     data: {code, data},
  //   } = await api.get_menu_list()
  //   // console.log(code, data)
  //   if (code == 0 && Array.isArray(data)) {
  //     menu = data
  //   }
  //   statusCode = code
  // } catch (e) {
  //   console.log(e)
  //   menu = []

  //   if (isServer && !appContext.ctx.req.originalUrl.startsWith('/error')) {
  //     appContext.ctx.res.writeHead(307, {Location: '/error?statusCode=500'})
  //     appContext.ctx.res.end()
  //   }
  // }

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext)
    statusCode = pageProps.code
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
    statusCode,
  }
}

export default App
