// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService, stockAnalysisService, quotaService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import sh_kLineUtil from '../../questionView/utils/sh_kLineUtil';

var logger = require('../../utils/logger');
import config from '../../config'
let ejs = require("ejs");

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
    // console.log("固定问答" + (new Date().getTime() - start));
    // console.log(params)
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


    var reportList = [];
    var answerType = info.answerResultType;
    var timeType = '';

    // console.log(info)
    //个股
    if (info.data.hasOwnProperty('stockReportResult')) {
      reportList = info.data.stockReportResult;
    }
    //行业
    else if (info.data.hasOwnProperty('industryAnalyseResult')) {
      reportList = info.data.industryAnalyseResult;
    }
    //大盘，策略
    else if (info.data.hasOwnProperty('strategyAdviceResult')) {
      reportList = info.data.strategyAdviceResult.semanticDocs;
      timeType = info.data.strategyAdviceResult.timeType;
    }
    //其它
    else {
      reportList = info.data.list;
    }



    //未找到相关研报
    if (!reportList) {
      // sendPreAnswerContent('未找到相关研报');
      // fixQuestion(result);
      res.send("没有数据");
      return;
    }

    var property = info.questionAnalyse[0].entity[0].property;
    //指数类型
    var indexType = property.name;
    var symbol = commonUtil.getSymbolByEntity(info.questionAnalyse[0].entity, false);
    //指数symbol须拼前缀
    if (answerType === '指数综评') {
      //创业板用大盘的
      if (indexType === '创业板指')
        symbol = 'sh000001';
      else {
        var marketType = property.marketType;
        symbol = commonUtil.getSymbolByEntity(info.questionAnalyse[0].entity);
        // symbol = marketType + symbol;
      }
    }

    var contentIds = [];
    for (var i = 0; i < reportList.length; i++) {
      var item = reportList[i];
      var sourceFrom = item.docType,
        summary = item.title,
        organization = sourceFrom === "weixin" ? item.weChatName : item.organization,
        author = item.author,
        ratingName = item.ratingName ? item.ratingName : '';
      //提取要点集合
      var tempArray = [];

      for (var x = 0; x < item.analyseFlags.length; x++) {
        var strategyName = item.analyseFlags[x];

        //根据不同的指数过滤要点
        if (indexType === '创业板指') {
          if (strategyName !== '创业板分析' && strategyName !== '日策略创业板分析')
            continue;
        } else if (indexType === '上证指数') {
          //取对应的时间
          if (timeType === '' && strategyName !== '大盘行情展望' && strategyName !== '日策略大盘行情展望')
            continue;
          else if (timeType === '短期' && strategyName !== '短期大盘行情展望' && strategyName !== '短期日策略大盘行情展望')
            continue;
          else if (timeType === '中长期' && strategyName !== '中长期大盘行情展望' && strategyName !== '中长期日策略大盘行情展望')
            continue;
        }


        //行业不用拼symbol
        if (answerType === '专家行业观点' || answerType === '行业' || answerType === '行业综评' || answerType === '行业个股推荐') {
          if (strategyName !== '行业分析' && strategyName !== '行业个股推荐' && strategyName !== '行业龙头分析')
            continue;
          symbol = '';
        }
        else if (answerType === '经营分析') {
          if (strategyName !== '外部环境' && strategyName !== '经营分析')
            continue;
        }
        else if (answerType === '竞争优势') {
          if (strategyName !== '经营分析' && strategyName !== '竞争优势')
            continue;
        }
        else if (answerType === '估值评级' || answerType === '个股综评') {
          if (strategyName !== '估值评级')
            continue;
        }
        else if (answerType === '业绩简评') {
          if (strategyName !== '业绩简评')
            continue;
        }

        summary = item.analyseResults[symbol + strategyName];
        summary = commonUtil.replaceLineBreak(summary);

        var temp = {};
        if (x == 0) {
          if (strategyName == '估值评级') {
            var tagKeyPoint = '';
            var clsBg = '';
            if (ratingName)
              tagKeyPoint = ratingName + '【评级】';
            else
              tagKeyPoint = subType;
            clsBg = '';
          } else {
            tagKeyPoint = strategyName.replace('大盘', '').replace('日策略', '');
            clsBg = 'box_bBlue';
          }
          temp.title = tagKeyPoint;
          temp.clsBg = clsBg;
        } else {
          temp.title = strategyName.replace('大盘', '').replace('日策略', '');
          temp.clsBg = '';
        }

        temp.contentId = commonUtil.generateRandomClassName('contentId');
        temp.expandBtnId = commonUtil.generateRandomClassName('expandBtnId');
        temp.foldBtnId = commonUtil.generateRandomClassName('foldBtnId');

        temp.content = summary;

        var temp1 = {};
        temp1.contentId = temp.contentId;
        temp1.expandBtnId = temp.expandBtnId;
        temp1.foldBtnId = temp.foldBtnId;

        contentIds.push(JSON.stringify(temp1))
        tempArray.push(temp);
      }
      item.tempArray = tempArray;

    }
    // res.json("hello world")


    let needJson = req.query.d === "j";
    let renderData = {
      reportList: reportList,
      timeType: timeType,
      sn: sn,
      info: info,
      predicateType:info.answerResultType,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      frameId: frameId,
      params: params,
      commonUtil: commonUtil,
      indexType: indexType,
      contentIds: contentIds,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/stockRelatedReports.ejs", renderData, function (err, str) {
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

    // res.render("stockRelatedReports",
    //   {
    //     reportList: reportList,
    //     timeType: timeType,
    //     sn: sn,
    //     info:info,
    //     noSource:req.query.noSource,
    //     preAnswer:info.preAnswerContent,
    //     frameId: frameId,
    //     params:params,
    //     commonUtil:commonUtil,
    //     indexType: indexType,
    //     contentIds:contentIds,
    //     host: config[process.env.NODE_ENV].host,
    //     config: config[process.env.NODE_ENV].resource
    //   })
  }

}
