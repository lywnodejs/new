const express = require('express')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const app = next({dev})
const handle = app.getRequestHandler()
const port = process.env.PORT || 3000
const {createProxyMiddleware} = require('http-proxy-middleware')

const {
  apiUrl,
  apiPrefix,
  activityApiPrefix,
  activityApiUrl,
} = require('./utils/config')

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
    activityApiPrefix,
    createProxyMiddleware({
      target: activityApiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/a-api': '',
      },
    }),
  )

  server.get('*', (req, res) => handle(req, res))

  await server.listen(port)
  console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line no-console
})()
