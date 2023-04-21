// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import generateStockHolderUtil from '../../questionView/utils/generateStockHolderUtil';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {

  renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    var tagBody = generateStockHolderUtil.generateStockHolder(result.data.tenShareholderList, result.data.tenFloatShareholderSList);
    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: tagBody,
      info: result,
      params: params,
      noSource: req.query.noSource,
      preAnswer: result.preAnswerContent,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/top10StockHolder.ejs", renderData, function (err, str) {
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

    // res.render("top10StockHolder",
    //   {
    //     sn:sn,
    //     data:tagBody,
    //     info:result,
    //     params:params,
    //     noSource:req.query.noSource,
    //     preAnswer:result.preAnswerContent,
    //     frameId:frameId,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }


};
