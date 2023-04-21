// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService, stockAnalysisService, quotaService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import redis from '../../libs/redisClient'
import config from '../../config'
let ejs = require("ejs");

var md5 = require('md5');
// let redisClient = redis.getClient();

module.exports = {
  //大盘技术分析
  stockTechAnalyse(req, res, next) {
    let params = {
      subjectCode: req.query.subjectCode,
      subjectName: req.query.subjectName,
      subjectMarket: req.query.subjectMarket,
      subjectType: '股票',
      predicateType: '个股技术分析',
      organization: req.query.organization
    }
    let start = new Date().getTime();
    var expired = 60 * 60 * 24;
    var key = md5([req.method, req.url, JSON.stringify(params)].join(':'));

    let info = null;
    fixQuestion(req, res, params, next);
    // redisClient.get(key, function (err, result) {
    //   console.log("缓存获取"+(new Date().getTime()-start))
    //   if (err) {
    //     fixQuestion(params,res,key,expired);
    //   }
    //   if (result) {
    //     info = JSON.parse(result);
    //     generateData(info,res);
    //   }else{
    //     fixQuestion(params,res,key,expired);
    //   }
    // })
  },

  renderTemp(req, res, next, info, params) {
    generateData(req, res, next, info, params);
  }

};

function renderFile(req, res, resultData, info) {


  let needJson = req.query.d === "j";
  let renderData = resultData;

  ejs.renderFile("./src/questionView/stockTechAnalyse.ejs", renderData, function (err, str) {
    console.log(err)
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
  //res.render('stockTechAnalyse', resultData);
}

async function fixQuestion(req, res, params, next) {

  let start = new Date().getTime();
  let info = await semanticApiService.apiFixQuestion(params);
  var type = info.answerResultType;
  if (type == "呼叫投顾") {
    res.send('Hello World!');
  } else if (type === '个股技术分析') {
    // redisClient.setex(key, expired, JSON.stringify(info));
    generateData(req, res, next, info);
  } else {
    res.send('Hello World!');
  }

}

async function generateData(req, res, next, info, params) {

  let frameId = req.query.frameId;
  var questionAnalyse = info.questionAnalyse[0];
  var chart_t = (new Date()).getTime();

  let ispop = req.query.ispop ? true : false


  try {
    var property = questionAnalyse.entity[0].property;
    var symbol = commonUtil.getSymbolByEntity(questionAnalyse.entity);
    var stockName = property.name;
  } catch (e) {
    // sendPreAnswerContent('小e用脑过度，请稍后再问，多谢理解');
    // saveLog('error', e.message, location.href, 0, 'stockOverallEval()', e.stack.toString());
    return;
  }
  console.log(property)
  let price = await quotaService.getSymbolPrice({ symbol: symbol });
  let kline = await stockAnalysisService.getKLineData({ val: property.marketType, symbol: property.code, type: 'day' });
  let kline2 = await stockAnalysisService.getKLineData_area({ val: property.marketType, symbol: property.code });

  console.log("自由问答行情接口：" + info.answerResultType + "：" + (new Date().getTime() - chart_t));
  // let klineL = await stockAnalysisService.getKLineData({val:property.marketType,symbol:property.code,type:'week'});
  let kinfo = {}
  if (kline.message.code == 0) {
    kinfo.WEEK_TXTQUSHI = kline.data.detail.WEEK_TXTQUSHI.memo;
    kinfo.DAY_TXTQUSHIVOL = kline.data.detail.DAY_TXTQUSHIVOL.memo;
    kinfo.DAY_TXTQUSHI = kline.data.detail.DAY_TXTQUSHI.memo;
    kinfo.WEEK_TXTQUSHIVOL = kline.data.detail.WEEK_TXTQUSHIVOL.memo;
  }
  // console.log(kline)
  //3, 指数技术分析，指数
  if ((symbol === 'sh000001') && (type === '指数技术分析' || type === '指数' || type === '上证指数综合评价' || type === '指数综评')) {
    // showIndexKline(result);
  }
  //4，st股，新股，展示K线
  else if (info.hasOwnProperty('data') && info.data.hasOwnProperty('stockTechnicalResult') && info.data.stockTechnicalResult) {
    // showKline(symbol, result.data.stockTechnicalResult, result, isPopup);
  }
  //5，技术分析
  else {
    /**
     * !isPopup非技术分析弹框 chartTabIndex=0 显示趋势分析
     * isPopup 技术分析弹框   chartTabIndex=1 显示区域分析
     * @type {number}
     */
  }
  let end = new Date().getTime();


  let final = {
    // subject:subject,
    quota: price,
    frameId: frameId,
    sn: chart_t,
    kinfo: kinfo,
    info: info,
    params: params,
    preAnswer: info.preAnswerContent,
    noSource: req.query.noSource,
    ispop: ispop,
    appKey: req.query.appKey,
    kdata: JSON.stringify(kline.data.detail),
    kdata_area: JSON.stringify(kline2.data[0]),
  }
  final.commonUtil = commonUtil;
  final.config = config[process.env.NODE_ENV].resource
  renderFile(req, res, final ,info)
}


