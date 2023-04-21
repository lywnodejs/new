// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import timeUtil from '../../questionView/utils/timeUtil';

import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {

  renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    var symbol = commonUtil.getSymbolByEntity(result.questionAnalyse[0].entity, true);

    var stock = commonUtil.getPropertyByEntity(result.questionAnalyse[0].entity, true);


    var mathRandom = new Date().getTime() + (Math.random() * 1000).toFixed(0);
    var t = (new Date()).getTime();
    // var chipsChart = newKlineCYQ.getTarget_CYQ_FS(mathRandom);



    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      symbol: symbol,
      info: result,
      preAnswer: result.preAnswerContent,
      code: stock.code,
      name: stock.name,
      params: params,
      noSource: req.query.noSource,
      mathRandom: mathRandom,
      t: t,
      timeUtil: timeUtil,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/distributionOfChips.ejs", renderData, function (err, str) {
      if (needJson) {
        res.send({
          info: result,
          content: str
        })
      } else {
        res.set('Content-Type', 'text/html');
        res.send(str);
      }
    });

    // res.render("distributionOfChips",
    //   {
    //     sn:sn,
    //     symbol:symbol,
    //     info:result,
    //     preAnswer:result.preAnswerContent,
    //     code:stock.code,
    //     name:stock.name,
    //     params:params,
    //     noSource:req.query.noSource,
    //     mathRandom:mathRandom,
    //     t:t,
    //     timeUtil:timeUtil,
    //     frameId:frameId,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
