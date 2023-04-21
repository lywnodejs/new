### 本地JSON数据

```
module.exports = {
  'GET /api/example': {
    data: {},
    code: 0,
    msg: ''
  }
}
```

### 代理远程服务器

```
module.exports = {
  'GET /api/example': 'http://example.com'
}

module.exports = {
  'GET /api/example': {
    target: 'http://example.com',
    pathRewrite: function (path, req) { return path.replace('/api', '/base/api') }
  }
}

```

更多例子[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#options)
