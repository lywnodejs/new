// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { SemanticApiService } from '../../service/index';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  //所属题材
  async renderTemp(req, res, next, info, params) {

    module.exports.renderData(req, res, next, info, params);
    console.log(info);

    // logger.info("用时", {
    //   semanticApi: semanticapiTime,
    //   totalTime: totalTime,
    // });
  },

  renderData(req, res, next, info, params) {
    var num = new Date().getMilliseconds();
    var arr = [];
    var isShow = true;
    for (var i in info.data.data) {
      arr.push(i);
      if (info.data.data[i].length == 0) {
        isShow = false;
      }
    }



    let needJson = req.query.d === "j";
    let renderData = {
      randomn: num,
      info: info,
      arr: arr,
      req: req,
      params: params,
      isShow: isShow,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/governmentData.ejs", renderData, function (err, str) {
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

    // res.render("governmentData",
    //   {
    //     randomn:num,
    //     info:info,
    //     arr:arr,
    //     req:req,
    //     params:params,
    //     isShow:isShow,
    //     noSource:req.query.noSource,
    //     preAnswer:info.preAnswerContent,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  },

};
