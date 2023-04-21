// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
import interfaceConfig from '../../libs/interfaceConfig'
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  //行业个股推荐
  async search(req, res, next) {
    let type = req.query.type;
    var params = interfaceConfig[type];
    if (params) {
      params.subjectName = req.query.subjectName;
      params.subjectCode = req.query.subjectCode;
      params.subjectMarket = req.query.subjectMarket;
    } else {
      res.send("暂不支持该指标");
    }

    var sn = (new Date()).getTime();
    let info = await semanticApiService.apiFixQuestion(params);

    if (info.answerResultType != "基础报价数据是") {
      res.send("无法回答");
    }
    let semanticapiTime = new Date().getTime() - sn;
    let totalTime = new Date().getTime() - sn;
    module.exports.renderTemp(req, res, next, info);

    logger.info("用时", {
      semanticApi: semanticapiTime,
      totalTime: totalTime,
    });

  },

  renderTemp(req, res, next, info, params) {
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: info.data,
      info: info,
      commonUtil: commonUtil,
      frameId: frameId,
      params: params,
      preAnswer: info.preAnswerContent,
      noSource: req.query.noSource,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/baseQuota.ejs", renderData, function (err, str) {
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




    // res.render("baseQuota",
    //   {
    //     sn:sn,
    //     data:info.data,
    //     info:info,
    //     commonUtil:commonUtil,
    //     frameId:frameId,
    //     params:params,
    //     preAnswer:info.preAnswerContent,
    //     noSource:req.query.noSource,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
