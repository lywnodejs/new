import React from 'react'
import axios from 'axios'
import {LocaleProvider} from 'antd-mobile'
import enUS from 'antd-mobile/lib/locale-provider/en_US'
import {useEffect} from 'react'
import Router from 'next/router'
import {cookieParse} from '~/utils'
import {apiUrl} from '~/utils/config'

import Head from 'next/head'

export const Context = React.createContext()

function App({Component, pageProps, menu}) {
  useEffect(() => {
    if ('addEventListener' in document) {
      document.addEventListener(
        'DOMContentLoaded',
        function () {
          window.FastClick.attach(document.body)
        },
        false,
      )
    }
  }, [])

  return (
    <LocaleProvider locale={enUS}>
      <Context.Provider value={{menu}}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"
          />
        </Head>
        <Component {...pageProps} />
      </Context.Provider>
    </LocaleProvider>
  )
}

App.getInitialProps = async (appContext) => {
  if (appContext.ctx.req !== undefined) {
    axios.defaults.baseURL = `${appContext.ctx.req.protocol}://${appContext.ctx.req.headers.host}`

    // axios.defaults.baseURL = `${apiUrl}`
    // console.log(appContext.ctx.req.headers.cookie)
    // console.log(appContext)
    console.log('axios.defaults.baseURL:', axios.defaults.baseURL)

    if (appContext.ctx.req.headers && appContext.ctx.req.headers.cookie) {
      axios.defaults.headers.common['Cookie'] =
        appContext.ctx.req.headers.cookie || ''
      const cookies = cookieParse(appContext.ctx.req.headers.cookie)

      if (cookies.sessionId !== undefined) {
        axios.defaults.headers.common['sessionId'] = cookies.sessionId
      } else {
        delete axios.defaults.headers.common['sessionId']
      }
    }
  } else {
    delete axios.defaults.baseURL
  }

  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext)
  }

  delete axios.defaults.headers.common['Cookie']

  return {
    pageProps,
  }
}

export default App
