// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
import valuationGradeController from "./infoAndResearchController";
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {

  renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();


    var property = result.questionAnalyse[0].entity[0].property
    var params = {
      marketType: property.marketType ? property.marketType : 'sz',
      stockCode: property.code ? property.code : '000001',
    };
    var divId = 'rating' + new Date().getTime();

    var reportList = [];
    var ratingResult = [];

    //个股
    if (result.data.hasOwnProperty('reportList')) {
      reportList = result.data.reportList.list;
    }
    //其它
    else {
      if (result.data.hasOwnProperty('list')) {
        reportList = result.data.list;
      } else {
        reportList = [];
      }

    }

    var ratingArr = [];
    var arrMax = 0;
    var ratingList = [];
    if (result.data.hasOwnProperty('ratingResult')) {
      ratingResult = result.data.ratingResult;
      // console.log(ratingResult)
      var ratingPaint = setValueGrade(ratingResult, true);
      ratingList = ratingResult.list;

      for (var j = 0; j < ratingList.length; j++) {
        ratingArr.push(ratingList[j].ratingNum)
      }
      var arrMax = Math.max.apply(null, ratingArr)
      if (arrMax <= 0) {
        arrMax = 1
      }


      // ratingPaint+=drawRating(ratingResult.list)
    }

    //未找到相关研报
    if (!reportList) {
      // sendPreAnswerContent('未找到相关研报');
      // fixQuestion(result);
      // getQuestionTabs(result);
      return;
    }

    var property = result.questionAnalyse[0].entity[0].property;
    //指数类型
    var indexType = property.name;
    var symbol = commonUtil.getSymbolByEntity(result.questionAnalyse[0].entity, false);



    var item;
    var contentIds = [];
    //生成随机数，作为class名
    var hideClass = commonUtil.generateRandomClassName('hideReport');

    let ispop = req.query.ispop ? true : false




    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      frameId: frameId,
      noSource: req.query.noSource,
      divId: divId,
      params: params,
      hideClass: hideClass,
      preAnswer: result.preAnswerContent,
      ratingPaint: ratingPaint,
      ratingArr: ratingArr,
      ratingList: ratingList,
      arrMax: arrMax,
      reportList: reportList,
      commonUtil: commonUtil,
      symbol: symbol,
      ispop: ispop,
      info: result,
      answerResultType: result.answerResultType,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/valuationGrade.ejs", renderData, function (err, str) {
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


    // res.render("valuationGrade",
    //   {
    //     sn:sn,
    //     frameId:frameId,
    //     noSource:req.query.noSource,
    //     divId:divId,
    //     params:params,
    //     hideClass:hideClass,
    //     preAnswer:result.preAnswerContent,
    //     ratingPaint:ratingPaint,
    //     ratingArr:ratingArr,
    //     ratingList:ratingList,
    //     arrMax:arrMax,
    //     reportList:reportList,
    //     commonUtil:commonUtil,
    //     symbol:symbol,
    //     ispop:ispop,
    //     info:result,
    //     answerResultType:result.answerResultType,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};


/**
 * 添加机构评级话术
 * @param result
 */
function setValueGrade(data, isPopup) {
  var stockNum = 0

  stockNum = data.stockNum

  var stockLevel = ''
  if (stockNum !== 0) {
    var stockPercent = (data.ranking / stockNum).toFixed(2);
    if (stockPercent <= 0.3) {
      stockLevel = '机构关注度较高'
    } else if (stockPercent > 0.3 && stockPercent <= 0.7) {
      stockLevel = '机构关注度一般'
    } else if (stockPercent > 0.7) {
      stockLevel = '机构关注度较低'
    }
  }
  if (data.ratingTotal == 0) {
    stockLevel = '机构关注度较低'
  }

  return '近半年有' + data.ratingTotal + '篇研报，' + stockLevel
}