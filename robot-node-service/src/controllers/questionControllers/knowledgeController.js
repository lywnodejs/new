// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService, quotaService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  //行业个股推荐
  async knowledge(req, res, next) {
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



    let upList = [];
    let downList = [];

    if (info.data.length != 0) {
      let item = info.data[0];
      upList = item.hasOwnProperty('upStream') ? item.upStream : [];
      downList = item.hasOwnProperty('downStream') ? item.downStream : [];
    }


    let type = "";
    if (info.answerResultType == "公司上下游") {
      type = "公司"
    } else {
      type = "行业"
    }

    let totalTime = new Date().getTime() - sn;



    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      frameId: frameId,
      info: info,
      type: type,
      params: params,
      commonUtil: commonUtil,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      upList: upList,
      downList: downList,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/knowledge.ejs", renderData, function (err, str) {
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

    // res.render("knowledge",
    //   {
    //     sn:sn,
    //     frameId:frameId,
    //     info:info,
    //     type:type,
    //     params:params,
    //     commonUtil:commonUtil,
    //     noSource:req.query.noSource,
    //     preAnswer:info.preAnswerContent,
    //     upList:upList,
    //     downList:downList,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })

    logger.info("用时", {
      totalTime: totalTime,
    });
  }

};
