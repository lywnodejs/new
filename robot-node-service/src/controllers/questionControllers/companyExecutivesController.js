// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  //行业个股推荐
  async companyExecutives(req, res, next) {
    let params = {
      subjectName: req.query.subjectName,
      subjectCode: req.query.subjectCode,
      subjectMarket: req.query.subjectMarket,
      subjectType: "股票",
      predicateType: "高管有",
      organization: req.query.organization
    }
    //获取高管答案
    var sn = (new Date()).getTime();
    let info = await semanticApiService.apiFixQuestion(params);

    if (info.answerResultType != "公司高管") {
      res.send("无法回答");
    }
    let totalTime = new Date().getTime() - sn;


    module.exports.renderTemp(req, res, next, info, params);

    logger.info("用时", {
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
      noSource: req.query.noSource,
      commonUtil: commonUtil,
      preAnswer: info.preAnswerContent,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/companyExecutives.ejs", renderData, function (err, str) {
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

    // res.render("companyExecutives",
    //   {
    //     sn:sn,
    //     data:info.data,
    //     info:info,
    //     params:params,
    //     noSource:req.query.noSource,
    //     commonUtil:commonUtil,
    //     preAnswer:info.preAnswerContent,
    //     frameId:frameId,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
