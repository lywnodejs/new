// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
import timeUtil from "../../questionView/utils/timeUtil";
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {

  renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    var temp = "";
    if (result.data.length > 0) {
      var len = result.data.length;


      temp += "<div class='box_tl02'><h5>";
      if (result.data.length > 5) {
        len = 5
      }
      for (var i = 0; i < len; i++) {
        temp += '<li onclick="showPDF(\'' + result.data[i].annTitle + '\',\'' + result.data[i].annUrl + '\')"><a>' + result.data[i].annTitle + '</a>';
        if (result.data[i].hasOwnProperty('pubAt')) {
          temp += '<h6 class="t_gray">' + timeUtil.getDataGridTimeFormat(result.data[i].pubAt) + '</h6>';
        }
        temp += "</li>";
      }
      temp += "</h5></div>";
    } else {
      temp = "没有数据"
    }



    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: temp,
      info: result,
      params: params,
      noSource: req.query.noSource,
      preAnswer: result.preAnswerContent,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/notice.ejs", renderData, function (err, str) {
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
    // res.render("notice",
    //   {
    //     sn:sn,
    //     data:temp,
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
