// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import config from '../../config';
import commonUtil from '../../questionView/utils/commonUtil';
import timeUtil from '../../questionView/utils/timeUtil';
let ejs = require("ejs");

module.exports = {
  renderTemp(req, res, next, info, params) {
    // JSON.parse("{t:2,e:s,''}");
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();



    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      frameId: frameId,
      params: params,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      commonUtil: commonUtil,
      timeUtil: timeUtil,
      info: info,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/stockOwnershipIncentive.ejs", renderData, function (err, str) {
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
    // console.log(info.data)
    // res.render("stockOwnershipIncentive",
    //   {
    //     sn:sn,
    //     frameId:frameId,
    //     params:params,
    //     noSource:req.query.noSource,
    //     preAnswer:info.preAnswerContent,
    //     commonUtil:commonUtil,
    //     timeUtil:timeUtil,
    //     info:info,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
