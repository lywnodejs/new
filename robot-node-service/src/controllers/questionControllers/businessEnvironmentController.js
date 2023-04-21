// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  //所属题材
  async renderTemp(req, res, next, info, params) {
    if (info.data.length !== 0) {
      var arr = [];
      var arrBox = [];
      var year_ = info.data[info.data.length - 1].years;
      for (var i = 0; i < info.data.length; i++) {
        if (info.data[i].years !== year_) { continue };
        var item = info.data[i];
        if (arrBox.indexOf(item.province) == -1) {
          arrBox.push(item.province);
          arr.push({
            province: item.province,
            dimension: []
          })
        }

        for (var l = 0; l < arr.length; l++) {
          if (arr[l].province == item.province) {
            arr[l].dimension.push({
              dimensionIndex: item.dimensionIndex,
              indexValue: item.indexValue,
              units: item.units
            })
          }
        }
      }
    } else {
      var arr = [];
    }

    module.exports.renderpolicy(req, res, next, parseInt((Math.random() + 1) * Math.pow(10, 20 - 1)), info, arr, year_, params);

    // logger.info("用时", {
    //   semanticApi: semanticapiTime,
    //   totalTime: totalTime,
    // });
  },
  renderpolicy(req, res, next, num, info, arr, year, params) {
    var index = 0;
    for (var i = 0; i < arr.length; i++) {
      var min = arr[i];
      var minIndex = i;
      for (var j = i + 1; j < arr.length; j++) {
        if (min.dimension[index].indexValue < arr[j].dimension[index].indexValue) {
          min = arr[j];
          minIndex = j;
        }
      }
      arr.splice(i, 0, min);
      arr.splice(minIndex + 1, 1);
    }


    let needJson = req.query.d === "j";
    let renderData = {
      randomn: num,
      data: arr,
      req: req,
      info: info,
      year: year,
      params: params,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/businessEnvironment.ejs", renderData, function (err, str) {
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

    // res.render("businessEnvironment",
    //   {
    //     randomn: num,
    //     data: arr,
    //     req: req,
    //     info: info,
    //     year: year,
    //     params: params,
    //     noSource: req.query.noSource,
    //     preAnswer: info.preAnswerContent,
    //     host: config[process.env.NODE_ENV].host,
    //     config: config[process.env.NODE_ENV].resource
    //   })
  }

};


