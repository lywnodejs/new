// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { SemanticApiService } from '../../service/index';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  //所属题材
  async renderTemp(req, res, next, info, params, boolean) {

    module.exports.renderpolicy(req, res, next, parseInt((Math.random() + 1) * Math.pow(10, 20 - 1)), info, params, boolean);
    // console.log(info);

    // logger.info("用时", {
    //   semanticApi: semanticapiTime,
    //   totalTime: totalTime,
    // });
  },

  renderpolicy(req, res, next, num, info, params, boolean) {



    let needJson = req.query.d === "j";
    let renderData = {
      randomn: num,
      info: info,
      boolean: boolean,
      req: req,
      params: params,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/policyContent.ejs", renderData, function (err, str) {
      if (needJson) {
        res.send({
          info: info,
          content: str
        })
      } else {
        res.set('Content-Type', 'text/html');
        res.send(str);
      }
    });

  },

};
