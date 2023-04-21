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


    module.exports.renderTemp(req, res, next, info);

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
    var season = '';
    var unit = info.data.unit;
    switch (type) {
      case "市盈率":
        data = info.data;
        console.log(data)
        type += '(TTM)';
        break;
      case "市净率":
        data = info.data;
        // answerType += '(动)';
        break;
      case "市销率":
        data = info.data;
        // answerType += '(动)';
        break;
      default:
        data = info.data;
        break;
    }

    var property = commonUtil.getPropertyByEntity(info.questionAnalyse[0].entity);
    var comTotal = (data.rank == undefined) ? '<h3>--</h3>' : '<h3>' + data.rank + '/<em>' + data.comTotal + '</em></h3>';



    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: data,
      unit: unit,
      info: info,
      params: params,
      preAwser: commonUtil.getPreAnswer(req.query.organization),
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      comTotal: comTotal,
      type: type,
      commonUtil: commonUtil,
      property: property,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/stockProfitData.ejs", renderData, function (err, str) {
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

    // res.render("stockProfitData",
    //   {
    //     sn:sn,
    //     data:data,
    //     unit:unit,
    //     info:info,
    //     params:params,
    //     preAwser:commonUtil.getPreAnswer(req.query.organization),
    //     noSource:req.query.noSource,
    //     preAnswer:info.preAnswerContent,
    //     comTotal:comTotal,
    //     type:type,
    //     commonUtil:commonUtil,
    //     property:property,
    //     frameId:frameId,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
