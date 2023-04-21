const express = require('express')
const next = require('next')
const {createProxyMiddleware} = require('http-proxy-middleware')
const {
  apiUrl,
  apiPrefix,
  gwApiPrefix,
  gwApiUrl,
  biApiPrefix,
  biApiUrl,
} = require('./utils/config')
const request = require('request').defaults({encoding: null})
const port = process.env.PORT || 3010
const app = next({dev: process.env.NODE_ENV !== 'production'})
const handle = app.getRequestHandler()

;(async () => {
  await app.prepare()
  const server = express()

  server.get('/napi/file-base64', (req, res, next) => {
    const fileUrl = req.query.fileUrl
    request.get(fileUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let data =
          'data:' +
          response.headers['content-type'] +
          ';base64,' +
          new Buffer(body).toString('base64')
        res.json({code: 0, data})
      }
    })
  })

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

  server.use(
    gwApiPrefix,
    createProxyMiddleware({
      target: gwApiUrl,
      changeOrigin: true,
      pathRewrite: {
        '^/gw-api': '/',
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

  server.get('*', (req, res) => handle(req, res))

  await server.listen(port)
  console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line no-console
})()
