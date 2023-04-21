const express = require('express')
const next = require('next')
const {createProxyMiddleware} = require('http-proxy-middleware')
const {
  apiUrl,
  apiPrefix,
  biApiPrefix,
  biApiUrl,
  cloudApiUrl,
  cloudApiPrefix,
} = require('./utils/config')

const port = process.env.PORT || 3011
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handle = app.getRequestHandler()

;(async () => {
  await app.prepare()
  const server = express()

  server.use(
    apiPrefix,
    createProxyMiddleware({
      target: apiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    }),
  )

  server.use(
    biApiPrefix,
    createProxyMiddleware({
      target: biApiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/bi-api': '/',
      },
    }),
  )

  server.use(
    cloudApiPrefix,
    createProxyMiddleware({
      target: cloudApiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/cloud-api': '/api',
      },
    }),
  )

  server.get('*', (req, res) => handle(req, res))

  await server.listen(port)
  console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line no-console
})()
