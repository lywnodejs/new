let express = require('express');
let domain = require('domain');
let log4js = require('log4js');
let bodyParser = require('body-parser');
let config = require('./config/index');
let path = require('path');
let cors = require('cors');

log4js.configure('log4js.json');
const logger = log4js.getLogger('file');

let app = express();

let options = {
  origin:'*',
  credentials:true,
  methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders:['Authorization','Origin','X-Requested-With','Content-Type','Accept'],
  exposedHeaders:['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus:200
}
app.use((req,res,next)=>{
  options.origin = req.get('origin');

  next();
})

app.options('*', cors(options))
app.use(cors(options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// 设置view目录为views，渲染引擎为ejs,静态资源文件夹为 static
app.set('views', path.join(__dirname, 'views'));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.set('view engine', 'ejs');

/**
 * 日志-error级别处理回调函数
 * @param req {Object} request对象
 * @param err {Object} error对象
 */
let errHandleFunc = function (req, err) {
  req = req || {};
  err = err || {};
  logger.error({req,err});
};

/**
 * 日志-info级别处理回调函数
 * @param req {Object} request对象
 * @param info {Object} info对象
 */
let infoHandleFunc = function (req, info) {
  req = req || {};
  info = info || {};
  logger.info({req,info});
};
infoHandleFunc(null, {name: 'start', env: app.get('env'), message: "start", message: ""})




console.log(app.get('env'))




let routes = require('./routes')(app);//引入路由

app.use(function (req, res, next) {
  let reqDomain = domain.create();
  reqDomain.on('error', function (err) { // 下面抛出的异常在这里被捕获
    errHandleFunc(req, err.messaage);
    res.render('error', {config: config[app.get('env')].resource, error: err});
  });
  reqDomain.run(next);
});


module.exports = app;
