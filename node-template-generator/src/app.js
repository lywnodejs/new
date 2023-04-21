var debug = require('debug');
var express = require('express');
var proxy = require('http-proxy-middleware');
var favicon = require('serve-favicon');
var domain = require('domain');
var fork = require('child_process').fork;
var spawn = require('child_process').spawn;
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
app.use(cors());

var options = {
  target: 'http://semantic-api-service:31001', // 目标服务器 host
  changeOrigin: true,               // 默认false，是否需要改变原始主机头为目标URL
  ws: true,                         // 是否代理websockets
  pathRewrite: {
    '^/semantic-api-service': 'http://semantic-api-service:31001'     // 重写请求，比如我们源访问的是api/old-path，那么请求会被解析为/api/new-path
  },
}
var exampleProxy = proxy(options);
//配置代理
app.use('/semantic-api-service', exampleProxy)
// import redis from "./libs/redisClient"
// redis.init(config[process.env.NODE_ENV].redis);


// var spawn_worker = function(n,end){//定义工作函数
//   var fibo = function fibo (n) {
//     return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
//   }
//   end(fibo(n));
// }

// var spawn_end = function(result){//定义工作函数结束的回调函数参数
//   console.log(result);
//   process.exit();
// }

// app.get('/test', function(req, res){
//   var n = ~~req.query.n || 1;
//   console.log(n)
//   //拼接-e后面的参数
//   var spawn_cmd = '('+spawn_worker.toString()+'('+n+','+spawn_end.toString()+'));'
//   console.log(spawn_cmd);//注意这个打印结果
//   var worker = spawn('node',['-e',spawn_cmd]);//执行node -e "xxx"命令
//   var fibo_res = '';
//   worker.stdout.on('data', function (data) { //接收工作函数的返回
//     fibo_res += data.toString();
//   });
//   worker.on('close', function (code) {//将结果响应给客户端
//     res.send(fibo_res);
//   });
//
// });


// process.on('message', function(m) {
// //接收主进程发送过来的消息
//   if(typeof m === 'object' && m.type === 'fibo'){
//     var num = fibo(~~m.num);
//     //计算jibo
//     process.send({type: 'fibo',result:num})
//     //计算完毕返回结果
//   }
// });
process.on('SIGHUP', function () {
  process.exit();//收到kill信息，进程退出
});

/**
 * 日志-error级别处理回调函数
 * @param req {Object} request对象
 * @param err {Object} error对象
 */
var errHandleFunc = function (req, err) {
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
var infoHandleFunc = function (req, info) {
  req = req || {};
  info = info || {};

  logger.info(info.name, {
    infoName: info.name,
    infoMsg: info.message,
    env: info.env
  });

};

// console.log(process.env.NODE_ENV)
// 日志目录
fs.existsSync(config.logDir) || fs.mkdirSync(config.logDir);

app.set('views', path.join(__dirname, 'questionView'));
app.set('view engine', 'ejs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cookieParser('rxhui robot'));
app.use(cookieSession({
  keys: ['secret1', 'secret2']
}));

infoHandleFunc(null, {name: 'start', env: app.get('env'), message: "start", message: ""})
console.log(app.get('env'))


app.use('/static', express.static(__dirname + '/static'));
app.use(express.static(__dirname + '/static'));
// app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes')(app);//引入路由
app.use(function (req, res, next) {
  var reqDomain = domain.create();
  reqDomain.on('error', function (err) { // 下面抛出的异常在这里被捕获
    errHandleFunc(req, err);
  });
  reqDomain.run(next);
});

process.on('uncaughtException', function (err) {
  errHandleFunc({}, err);
});

process.on('unhandledRejection', function (reason, promise) {
  errHandleFunc({}, new Error(reason));
  // res.location('/error');
});


app.use(function (err, req, res, next) {
  errHandleFunc(req, err);
  res.render('error', {config: config[app.get('env')].resource, error: err});
  next();
});


module.exports = app;
