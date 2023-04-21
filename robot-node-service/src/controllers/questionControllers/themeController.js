// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
let ejs = require("ejs");

module.exports = {
  //所属题材
  async theme(req, res, next) {
    let info = await semanticApiService.apiStockDetail(req.query);

    if (info.answerResultType !== "所属题材") {
      res.send("无法回答");
    } else {
      module.exports.renderTemp(req, res, next, info);
    }
  },

  renderTemp(req, res, next, info, params) {
    // console.log(info.data)
    if (info.data === undefined) {
      res.send("没有数据");
      return;
    }

    let frameId = req.query.frameId;
    let ispop = req.query.ispop;
    let mapList = info.data.mapList;
    let sn = (new Date()).getTime();
    let property = commonUtil.getPropertyByEntity(info.questionAnalyse[0].entity);

    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: info.data,
      info: info,
      ispop: ispop,
      params: params,
      preAnswer: info.preAnswerContent,
      noSource: req.query.noSource,
      commonUtil: commonUtil,
      frameId: frameId,
      mapList: mapList,
      property: property,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/stockTheme.ejs", renderData, function (err, str) {
      // console.log(err)
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

    // res.render("stockTheme",
    //   {
    //     sn:sn,
    //     data:info.data,
    //     info:info,
    //     ispop:ispop,
    //     params:params,
    //     preAnswer:info.preAnswerContent,
    //     noSource:req.query.noSource,
    //     commonUtil:commonUtil,
    //     frameId:frameId,
    //     mapList:mapList,
    //     property:property,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
