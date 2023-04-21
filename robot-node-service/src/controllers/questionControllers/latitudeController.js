// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { SemanticApiService } from '../../service/index';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  //所属题材
  async renderAll(req, res, next, info, params) {
    if (info.data.length !== 0) {
      var arr = [];
      var arrBox = [];
      for (var i = 0; i < info.data.length; i++) {
        var item = info.data[i];
        if (arrBox.indexOf(item.dimensionIndex) == -1) {
          arrBox.push(item.dimensionIndex);
          arr.push({
            dimensionIndex: item.dimensionIndex,
            units: item.units,
            years: []
          })
        }

        for (var l = 0; l < arr.length; l++) {
          if (arr[l].dimensionIndex == item.dimensionIndex) {
            arr[l].years.unshift({
              years: item.years,
              indexValue: item.indexValue,
            })
          }
        }
      }
    } else {
      var arr = [];
    }
    module.exports.renderData(req, res, next, info, arr, params);
    console.log(info);

    // logger.info("用时", {
    //   semanticApi: semanticapiTime,
    //   totalTime: totalTime,
    // });
  },

  renderData(req, res, next, info, arr, params) {
    var num = new Date().getMilliseconds();




    let needJson = req.query.d === "j";
    let renderData = {
      randomn: num,
      info: info,
      req: req,
      data: arr,
      params: params,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/latitudeAll.ejs", renderData, function (err, str) {
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

    // res.render("latitudeAll",
    //   {
    //     randomn:num,
    //     info:info,
    //     req:req,
    //     data:arr,
    //     params:params,
    //     noSource:req.query.noSource,
    //     preAnswer:info.preAnswerContent,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  },

};
