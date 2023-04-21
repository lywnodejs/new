const path = require('path'),
    fs = require('fs'),
    CST = require('./Constanst'),
    ROOT = CST.ROOT,
    MOCK = CST.MOCK,
    configs = require('../config'),
    wbpcfg = require('../webpack.config.dev'),
    webpack = require('webpack'),
    compiler = webpack(wbpcfg),
    midware = require('webpack-dev-middleware'),
    hotware = require('webpack-hot-middleware'),
    express = require('express'),
    app = express(),
    port = configs.server.port
console.log(ROOT)
//  自动编译
app.use(midware(compiler, {
    noInfo: true,
    headers: {
        'X-Custom-Header': 'yes'
    },
    //    是否修改文件后就立刻编译，否则请求时才会编译
    lazy: false,
    publicPath: '/'
}))
//  自动热加载
app.use(hotware(compiler, {
    log: false,
    //    此处要与client的path保持一致
    path: configs.server.path,
    heartbeat: 2000
}));




app.get('/', (req, rsp) => {
    rsp.sendFile(path.resolve(ROOT, './index.html'))
})

app.all('/**', (req, rsp, next) => {
    let method = req.method.toUpperCase(),
        url = req.path
    if (method == 'GET' || method == 'POST' && url) {
        if (url.startsWith('/')) {
            url = url.substr(1)
        }
        const jsonFile = path.resolve(MOCK, url + '.json')
        fs.exists(jsonFile, exist => {
            if (exist) {
                rsp.set('Content-Type', 'application/json;charset=UTF-8')
                rsp.sendFile(jsonFile)
                return
            }
            next()
        })
    } else {
        next()
    }
})


app.use('/', express.static(path.resolve(ROOT, './static')))
app.use('/static', express.static(path.resolve(ROOT, './dist/static')))
app.use('/lib', express.static(path.resolve(ROOT, './static/lib')))

// 添加SDL路由
require('./route/sdl')(app)

// 添加安全事件路由
require('./route/alarm')(app)

require('./route/inStats')(app)

app.listen(port, function() {
    console.log(`App Server start at ${port}!`)
})