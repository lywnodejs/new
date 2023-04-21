// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  //所属题材
  async company(req, res, next) {

    let params = {
      subjectName: req.query.subjectName,
      subjectCode: req.query.subjectCode,
      subjectMarket: req.query.subjectMarket,
      subjectType: "股票",
      predicateType: "主营是",
      organization: req.query.organization
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

    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: info.data,
      info: info,
      params: params,
      preAnswer: info.preAnswerContent,
      noSource: req.query.noSource,
      commonUtil: commonUtil,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/companyMain.ejs", renderData, function (err, str) {
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

    // res.render("companyMain",
    //   {
    //     sn:sn,
    //     data:info.data,
    //     info:info,
    //     params:params,
    //     preAnswer:info.preAnswerContent,
    //     noSource:req.query.noSource,
    //     commonUtil:commonUtil,
    //     frameId:frameId,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
