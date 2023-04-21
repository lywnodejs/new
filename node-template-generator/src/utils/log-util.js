var winston = require('winston');
var format = require('./format.js');
var config = require('../config/index');
var _ = require('underscore');

var LEVELS= { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 };

var loggerImpl = new winston.Logger({
  transports: [
    new (winston.transports.Console)({
      name: 'debug',
      level: 'debug',
      colorize: true,
      timestamp: function(){
        return format.formatTime(Date.now())
      },
    }),
    new (winston.transports.File)({
      name: 'info',
      filename: config.logDir + 'info.log',
      level: 'debug',
      timestamp: function(){
        return format.formatTime(Date.now())
      },
      colorize: true,
      json: false,
    }),
    new (winston.transports.File)({
      name: 'error',
      filename: config.logDir + 'error.log',
      level: 'error',
      timestamp: function(){
        return format.formatTime(Date.now())
      },
      colorize: true,
      json: false
    })
  ]
});


function getArgsArray(args, req) {
  var arr = [];
  var omitArr = ['password', 'gtFundPassword'];
  for (var i = 0; i < args.length; i++) {
    //过滤掉敏感密码字段
    var tempArg = args[i];
    if(args[i] && typeof args[i] == 'object') {
      tempArg =_.omit(args[i], omitArr)
    }
    arr.push(tempArg);
  }
  return arr;
}

var logger = {
  req:null,
  setReq:function(value){
    this.req = value;
  },
  debug:function(){
    try {
      var logLevel = (config.getConfig("logLevel"));
      if(LEVELS[logLevel] < 4){
        return;
      }
      var argsArr = getArgsArray(arguments, this.req);
      argsArr.unshift('debug');
      loggerImpl.log.apply(loggerImpl, argsArr);
    } catch (e) {
      console.error(e);
    }

  },
  info:function(){
    try {
      var argsArr = getArgsArray(arguments, this.req);
      loggerImpl.info.apply(loggerImpl, argsArr);
    } catch (e) {
      console.error(e);
    }
  },
  error:function() {
    try {
      var argsArr = getArgsArray(arguments,this.req);
      loggerImpl.error.apply(loggerImpl, argsArr);
    } catch (e) {
      console.error(e);
    }
  }
};

module.exports = {
  getLogger: function(){
    return logger;
  }
};
