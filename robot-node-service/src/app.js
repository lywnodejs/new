// var debug = require('debug');
import {semanticApiService} from "./service";

var express = require('express');
var favicon = require('serve-favicon');
var domain = require('domain');
// var fork = require('child_process').fork;
// var spawn = require('child_process').spawn;
var fs = require('fs');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var logger = require('./utils/logger');
// var ifile = require("ifile");
var config = require('./config/index');
var app = express();
var cors = require('cors');
var proxy = require('http-proxy-middleware');

var Bot = require('./bot');

app.use(cors());
app.use(favicon(path.join(__dirname, 'static/images/', 'favicon.ico')));

// 配置代理
// var proxyConfig = config['proxy'];
// var proxyConfig = config[process.env.NODE_ENV]['proxy'];
var proxyConfig = require('./config/proxy-'+process.env.NODE_ENV);
// console.log('env: '+process.env.NODE_ENV)
if (proxyConfig && proxyConfig.length > 0) {
  for (var index in proxyConfig ) {
    var proxyItem = proxyConfig[index];
    var proxyOption = proxyItem.options;
    proxyOption.changeOrigin = true;
    proxyOption.ws = true;
    app.use(proxyItem.name, proxy(proxyOption));
  }
}

process.on('SIGHUP', function() {
  process.exit();//收到kill信息，进程退出
});

/**
 * 日志-error级别处理回调函数
 * @param req {Object} request对象
 * @param err {Object} error对象
 */
var errHandleFunc = function(req, err) {
  req = req || {};
  err = err || {};
  logger.error(err.name, {
    time: new Date().toLocaleString(),
    requestHeaders: req.headers || {},
    url: req.url,
    errName: err.name,
    errMsg: err.message,
    errStack: err.stack
  });
};

/**
 * 日志-info级别处理回调函数
 * @param req {Object} request对象
 * @param err {Object} error对象
 */
var infoHandleFunc = function(req, info) {
  req = req || {};
  info = info || {};

  logger.info(info.name, {
    infoName: info.name,
    infoMsg: info.message,
    env:info.env
  });

};

// console.log(process.env.NODE_ENV)
// 日志目录
fs.existsSync(config.logDir) || fs.mkdirSync(config.logDir);

// 设置view目录为views，渲染引擎为ejs
if(config.getConfig('robotResource') === 'source'){
  app.set('views', path.join(__dirname, 'questionView'));
  app.use('/static', express.static(path.join(__dirname, 'static')));
} else {
  app.set('views', path.join(__dirname, '..' ,'dist/questionView'));
  app.use('/static', express.static(path.join( __dirname, '..' ,'dist/static')));
}

// app.set('views', path.join(__dirname, 'questionView'));
app.set('view engine', 'ejs');

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(cookieParser('rxhui robot'));
app.use(cookieSession({
  keys: ['secret1', 'secret2']
}));

infoHandleFunc(null,{name:'start',env:app.get('env'),message:"start"})
// console.log(app.get('env'))

// app.use('/static',express.static(__dirname + '/static'));
var routes = require('./routes')(app);//引入路由
app.use(function (req, res, next) {
  var reqDomain = domain.create();
  reqDomain.on('error', function (err) { // 下面抛出的异常在这里被捕获
    errHandleFunc(req, err);
  });
  reqDomain.run(next);
});

process.on('uncaughtException', function (err) {
  // console.log(err)
  errHandleFunc({}, err);
});

process.on('unhandledRejection', function (reason, promise) {
  // console.log(reason)
  errHandleFunc({},new Error(reason));
  // res.location('/error');
});


app.use(function (err, req, res, next) {
  // console.log(err)
  errHandleFunc(req, err);
  res.render('error',{config:config[app.get('env')].resource,error:err});
  next();
});


// 探活请求
app.head('/deuros', function(req, res){
  res.sendStatus(204);
});

app.post('/deuros', function(req, res){
  req.rawBody = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){
    req.rawBody += chunk;
  });

  req.on('end', function(){

    var param = JSON.parse(req.rawBody);
    if(param.session.new == true){
      var b = new Bot(param);
      b.run().then(function(result){
        res.send(result);
      });
    }else{
      if(param.request.hasOwnProperty("query")){
        var txt = param.request.query.original;
        heihei(txt).then((result) => {
          let name = "addRequest",
              value = result;
          param[name] = value;
          var b = new Bot(param);
          b.run().then(function(result){
            res.send(result);
          });
        })
      }else{
        var b = new Bot(param);
        b.run().then(function(result){
          res.send(result);
        });
      }

    }


  });
})
async function heihei(txt){
  let params = {question: txt};
  let info = await semanticApiService.freeQuestion(params);
  return info.data;
}

module.exports = app;
