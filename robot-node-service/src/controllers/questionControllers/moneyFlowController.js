// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {

  renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    var navId = commonUtil.generateRandomClassName('nav');

    if (!result.data) {
      res.send('暂无数据');
      return;
    }


    let ispop = req.query.ispop ? true : false




    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      list: result.data,
      preAnswer: result.preAnswerContent,
      navId: navId,
      params: params,
      info: result,
      frameId: frameId,
      noSource: req.query.noSource,
      answerResultType: result.answerResultType,
      ispop: ispop,
      commonUtil: commonUtil,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/moneyFlow.ejs", renderData, function (err, str) {
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

    // res.render("moneyFlow",
    //   {
    //     sn:sn,
    //     list:result.data,
    //     preAnswer:result.preAnswerContent,
    //     navId:navId,
    //     params:params,
    //     info:result,
    //     frameId:frameId,
    //     noSource:req.query.noSource,
    //     answerResultType:result.answerResultType,
    //     ispop:ispop,
    //     commonUtil:commonUtil,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
