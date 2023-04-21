const express = require('express')
const next = require('next')
const {createProxyMiddleware} = require('http-proxy-middleware')
const {apiUrl, apiPrefix, httpUrl, httpPrefix} = require('./utils/config')

const port = process.env.PORT || 7000
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handle = app.getRequestHandler()

;(async () => {
  await app.prepare()
  const server = express()

  server.use(
    `${apiPrefix}${httpPrefix}`,
    createProxyMiddleware({
      target: httpUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api/design': '/design',
      },
    }),
  )

  server.use(
    apiPrefix,
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api',
      },
    }),
  )

  server.get('/sso/auth/:sessionId', (req, res) => {
    // console.log(req.params)
    res.cookie('sessionId', req.params.sessionId)
    res.redirect('/')
  })

  server.get('*', (req, res) => handle(req, res))

  await server.listen(port)
  console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line no-console
})()
