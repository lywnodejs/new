// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService, quotaService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  async renderTemp(req, res, next, result, params) {
    // JSON.parse("{t:2,e:s,''}");
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    var shareholderAmountList = result.data.shareholderAmountList;
    var lastItem = shareholderAmountList[0];
    var chartId = commonUtil.generateRandomClassName('chart');



    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      shareholderAmountList: JSON.stringify(shareholderAmountList),
      lastItem: lastItem,
      info: result,
      noSource: req.query.noSource,
      preAnswer: result.preAnswerContent,
      frameId: frameId,
      chartId: chartId,
      params: params,
      commonUtil: commonUtil,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/stockHolderNumChange.ejs", renderData, function (err, str) {
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

    // res.render("stockHolderNumChange",
    //   {
    //     sn:sn,
    //     shareholderAmountList:JSON.stringify(shareholderAmountList),
    //     lastItem:lastItem,
    //     info:result,
    //     noSource:req.query.noSource,
    //     preAnswer:result.preAnswerContent,
    //     frameId:frameId,
    //     chartId:chartId,
    //     params:params,
    //     commonUtil:commonUtil,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
