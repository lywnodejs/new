// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService, quotaService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  //个股推荐
  async stockRecommand(req, res, next) {

    let params = {
      subjectName: req.query.subjectName,
      subjectType: "行业概念",
      predicateType: "选股票",
      organization: req.query.organization
    }
    //获取行业推荐答案
    let info = await semanticApiService.apiFixQuestion(params);

    if (info.answerResultType != "股票推荐") {
      res.send("无法回答");
      return;
    }
    module.exports.renderTemp(req, res, next, info)
  },

  async renderTemp(req, res, next, info, params) {
    // JSON.parse("{t:2,e:s,''}");
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    // res.json("hello world")

    // console.log(info)
    let symbolList = '';
    if (info.data == undefined) {
      res.send("没有数据");
      return;
    }
    //技术选股
    let arrRecStock = info.data.techniqueRecommendStocks ? info.data.techniqueRecommendStocks : [];
    //专家推荐
    let arrIndustry = info.data.recommendStocks ? info.data.recommendStocks : [];

    if (arrIndustry.length > 30) {
      arrIndustry = arrIndustry.splice(0, 30)
    }

    let predicateType = '股票推荐理由';
    let timeType = info.data.timeType;


    try {
      if (info.questionAnalyse[0].hasOwnProperty('entity') && info.questionAnalyse[0].entity.length > 0) {
        predicateType = '行业个股推荐理由';
      }
    } catch (e) {
      // saveLog('error', e.message, 'answer-2.js', 0, 'stockRecommend()', e.stack.toString());
    }

    let priceDict = {};
    // 拼股票代码
    for (let i = 0; i < arrIndustry.length; i++) {
      priceDict[arrIndustry[i].stockCode] = {};
      arrIndustry[i].lineClass = commonUtil.generateRandomClassName('recommended');
      symbolList += arrIndustry[i].marketType + "_" + arrIndustry[i].stockCode + ",";
    }
    for (let n = 0; n < arrRecStock.length; n++) {
      priceDict[arrRecStock[n].stockCode] = {};
      symbolList += arrRecStock[n].marketType + "_" + arrRecStock[n].stockCode + ",";
    }


    let hqstart = new Date().getTime();

    let price = await quotaService.getQuota({ symbol: symbolList });
    let hqend = new Date().getTime() - hqstart;
    let totalTime = new Date().getTime() - sn;



    for (let i = 0; i < price.items.length; i++) {
      priceDict[price.items[i].stkCode] = price.items[i];
    }

    let needJson = req.query.d === "j";
    let renderData = {
      arrRecStock: arrRecStock,
      timeType: timeType,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      sn: sn,
      info: info,
      frameId: frameId,
      params: params,
      predicateType: predicateType,
      priceDict: priceDict,
      host: config[process.env.NODE_ENV].host,
      arrIndustry: arrIndustry,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/stockRecommand.ejs", renderData, function (err, str) {
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

    // res.render("stockRecommand",
    //   {
    //     arrRecStock: arrRecStock,
    //     timeType: timeType,
    //     noSource: req.query.noSource,
    //     preAnswer: info.preAnswerContent,
    //     sn: sn,
    //     info: info,
    //     frameId: frameId,
    //     params: params,
    //     predicateType: predicateType,
    //     priceDict: priceDict,
    //     host: config[process.env.NODE_ENV].host,
    //     arrIndustry: arrIndustry,
    //     config: config[process.env.NODE_ENV].resource
    //   })

    logger.info("用时", {
      quotaApi: hqend,
      totalTime: totalTime,
    });
  }

};
