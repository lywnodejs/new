// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService, stockAnalysisService, quotaService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import sh_kLineUtil from '../../questionView/utils/sh_kLineUtil';
let ejs = require("ejs");

var logger = require('../../utils/logger');
import config from '../../config'

var md5 = require('md5');
// let redisClient = redis.getClient();

module.exports = {
  //大盘技术分析
  stockRelated(req, res, next) {
    let params = {}
    module.exports.fixQuestion(req, res, next, params, expired, key);
  },


  async fixQuestion(req, res, next, params, expired, key) {
    let start = new Date().getTime();
    let info = await semanticApiService.apiFixQuestion(params);
    let infoT = new Date().getTime() - start;
    var type = info.answerResultType;

    if (type == "呼叫投顾") {
      res.send('Hello World!');
    } else if (type === '上证指数综合评价' || type === '指数综评') {
      // redisClient.setex(key, expired, JSON.stringify(info));
      module.exports.generateData(req, res, next, info, start, infoT);
    } else {
      res.send('Hello World!');
    }

  },

  async renderTemp(req, res, next, info, params) {
    // JSON.parse("{t:2,e:s,''}");
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();


    var reportList = info.data;
    var answerType = info.answerResultType;
    var timeType = '';


    //未找到相关研报
    if (!reportList) {
      // sendPreAnswerContent('未找到相关研报');
      // fixQuestion(result);
      res.send("没有数据");
      return;
    }
    for (let i = 0; i < reportList.length; i++) {
      reportList[i].contentId = commonUtil.generateRandomClassName('contentId');
      reportList[i].expandBtnId = commonUtil.generateRandomClassName('expandBtnId');
      reportList[i].foldBtnId = commonUtil.generateRandomClassName('foldBtnId');
    }

    var property = info.questionAnalyse[0].entity[0].property;

    // res.json("hello world")


    var list = info.data;
    var dataList = [];
    for (var i = 0; i < list.length; i++) {
      list[i].text = encodeURIComponent(list[i].text)
    }
    var speechAnwserTxt = info.speechAnswerContent;
    speechAnwserTxt = speechAnwserTxt.replace(/\s*/g, "");



    let needJson = req.query.d === "j";
    let renderData = {
      reportList: reportList,
      timeType: timeType,
      sn: sn,
      info: info,
      list: list,
      params: params,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      speechAnwser: speechAnwserTxt,
      frameId: frameId,
      commonUtil: commonUtil,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/industryRelatedData.ejs", renderData, function (err, str) {
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

    // res.render("industryRelatedData",
    //   {
    //     reportList: reportList,
    //     timeType: timeType,
    //     sn: sn,
    //     info:info,
    //     list:list,
    //     params:params,
    //     noSource:req.query.noSource,
    //     preAnswer:info.preAnswerContent,
    //     speechAnwser:speechAnwserTxt,
    //     frameId: frameId,
    //     commonUtil:commonUtil,
    //     host: config[process.env.NODE_ENV].host,
    //     config: config[process.env.NODE_ENV].resource
    //   })
  }

}
