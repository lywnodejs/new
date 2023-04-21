// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import timeUtil from '../../questionView/utils/timeUtil';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {

  renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    console.log(result)
    var temp = "";
    if (result.data.length > 0) {
      temp += "<div class='box_tl02'><h5>";
      for (var i = 0; i < result.data.length; i++) {
        temp += "<li style='padding-top: 10px'><a onclick=\"showInformationDetail('" + result.data[i].id + "','" + result.answerResultType + "')\">" + result.data[i].title + "</a>";
        if (result.data[i].hasOwnProperty('time')) {
          temp += '<h6 class="t_gray">' + timeUtil.getDataGridTimeFormat(result.data[i].time) + '</h6>';
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

    ejs.renderFile("./src/questionView/infoAndResearch.ejs", renderData, function (err, str) {
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


  }

};
