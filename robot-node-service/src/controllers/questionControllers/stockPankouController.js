// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  //所属题材
  async pankou(req, res, next) {

    let params = {

    }
    //获取高管答案
    var sn = (new Date()).getTime();
    let info = await semanticApiService.apiFixQuestion(params);

    if (info.answerResultType != "公司主营") {
      res.send("无法回答");
    }
    let semanticapiTime = new Date().getTime() - sn;
    // res.json("hello world")
    let totalTime = new Date().getTime() - sn;

    module.exports.renderTemp(req, res, next, info, params);

    logger.info("用时", {
      semanticApi: semanticapiTime,
      totalTime: totalTime,
    });

  },

  renderTemp(req, res, next, info, params) {
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    var type = info.answerResultType;
    var data = '';
    var unit = '';
    switch (type) {
      case "开盘价":
        data = info.data.hasOwnProperty('openPrice') ? info.data.openPrice : '--';
        break;
      case "收盘价":
        data = info.data.newPrice === 0 ? info.data.preClosePrice : info.data.newPrice;
        break;
      case "现价":
        data = info.data.hasOwnProperty('newPrice') ? info.data.newPrice : '--';
        break;
      case "最高价":
        data = info.data.hasOwnProperty('highPrice') ? info.data.highPrice : '--';
        break;
      case "最低价":
        data = info.data.hasOwnProperty('lowPrice') ? info.data.lowPrice : '--';
        break;
      case "涨跌幅":
        data = info.data.hasOwnProperty('rise') ? info.data.rise : '--';
        unit = '%';
        break;
      case "成交量":
        data = info.data.hasOwnProperty('volume') ? info.data.volume : '--';
        break;
      case "成交额":
        data = info.data.hasOwnProperty('amount') ? info.data.amount : '--';
        break;
      case "换手率":
        data = info.data.hasOwnProperty('turnOver') ? info.data.turnOver : '--';
        unit = '%';
        break;
      case "振幅":
        data = info.data.hasOwnProperty('amplitude') ? info.data.amplitude : '--';
        unit = '%';
        break;
      case "总市值":
        data = info.data.hasOwnProperty('capitalization') ? commonUtil.formatAmount(info.data.capitalization) : '--';
        unit = '元';
        break;
      case "流通市值":
        data = info.data.hasOwnProperty('circulationCapitalization') ? commonUtil.formatAmount(info.data.circulationCapitalization) : '--';
        unit = '元';
        break;
    }

    var property = commonUtil.getPropertyByEntity(info.questionAnalyse[0].entity);



    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: data,
      unit: unit,
      info: info,
      params: params,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      commonUtil: commonUtil,
      property: property,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/stockPankouData.ejs", renderData, function (err, str) {
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

    // res.render("stockPankouData",
    //   {
    //     sn:sn,
    //     data:data,
    //     unit:unit,
    //     info:info,
    //     params:params,
    //     noSource:req.query.noSource,
    //     preAnswer:info.preAnswerContent,
    //     commonUtil:commonUtil,
    //     property:property,
    //     frameId:frameId,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
