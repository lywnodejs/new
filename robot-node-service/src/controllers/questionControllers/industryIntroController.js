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

    let list = result.data;
    let msg = ""
    for (let i = 0; i < list.length; i++) {
      msg += list[i] + '<br>';
    }

    let contentId = commonUtil.generateRandomClassName('contentId');
    let expandBtnId = commonUtil.generateRandomClassName('expandBtnId');
    let foldBtnId = commonUtil.generateRandomClassName('foldBtnId');



    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: msg,
      frameId: frameId,
      info: result,
      params: params,
      contentId: contentId,
      expandBtnId: expandBtnId,
      foldBtnId: foldBtnId,
      preAnswer: result.preAnswerContent,
      noSource: req.query.noSource,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/industryIntro.ejs", renderData, function (err, str) {
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

    // res.render("industryIntro",
    //   {
    //     sn:sn,
    //     data:msg,
    //     frameId:frameId,
    //     info:result,
    //     params:params,
    //     contentId:contentId,
    //     expandBtnId:expandBtnId,
    //     foldBtnId:foldBtnId,
    //     preAnswer:result.preAnswerContent,
    //     noSource:req.query.noSource,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
