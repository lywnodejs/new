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

    var reportList = result.data.list;
    var item;
    var temp = "";
    var eventLength = result.data.list.length;


    if (eventLength > 1) {
      // 事件概述的tabs
      temp += "<nav>";
      for (var i = 0; i < eventLength; i++) {
        var ifEventOn = i == 0 ? 'on' : '';
        var eventName = changeNumToHan(i + 1);
        temp += "<a class=' " + ifEventOn + "' onclick=changeTabs(event)>事件" + eventName + "</a>";
      }
      temp += "</nav>";
    }

    for (var i = 0; i < reportList.length; i++) {
      item = reportList[i];
      var symbol = commonUtil.getSymbolByEntity(result.questionAnalyse[0].entity, false);
      var sourceFrom = item.docType,
        summary = item.title,
        organization = sourceFrom === "weixin" ? item.weChatName : item.organization,
        author = item.author,
        ratingName = item.ratingName ? item.ratingName : '';
      var ifEventShow = i == 0 ? 'show' : '';
      temp += "<div class='nav_con " + ifEventShow + "'>";
      temp += " <h6 class='space_between'>";
      temp += "<span>来源：" + organization + "／" + author + "</span>";
      temp += "<span class='date'>" + commonUtil.changeTime(item.publishAt) + "</span>";
      temp += "</h6>";
      //此事件内容标题
      var analyseFlagsList = item.analyseFlags;
      //此事件内容
      var analyseResultsList = item.analyseResults;
      var ifShowD = "show";
      for (var j = 0; j < analyseFlagsList.length; j++) {
        var lineClass = commonUtil.generateRandomClassName('hideArticle');
        var analyseResultsContent = analyseResultsList[symbol + analyseFlagsList[j]];
        temp += "<div class='box_show box_show_btn " + lineClass + "'>";
        temp += "  <h4>" + analyseFlagsList[j] + "</h4>";
        temp += "  <h5 class='show_row5 '>" + analyseResultsContent + "</h5>";
        if (analyseResultsContent.length < 120) {
          ifShowD = 'hide';
        }
        temp += "   <a " + ifShowD + " class='a_more a" + lineClass + "' onclick=showMoreh5AndShowUp('" + lineClass + "')>展开<i class='icon-arrowD'></i></a>";
        temp += "<a style='display:none;' class='a_more aShow" + lineClass + "' onclick=hideMoreh5AndShowUp('" + lineClass + "')>收起<i class='icon-arrowT'></i></a>";
        temp += "</div>";
      }
      temp += "</div>";
    }



    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: temp,
      info: result,
      params: params,
      preAnswer: result.preAnswerContent,
      frameId: frameId,
      noSource: req.query.noSource,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/eventOverview.ejs", renderData, function (err, str) {
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

    // res.render("eventOverview",
    //   {
    //     sn:sn,
    //     data:temp,
    //     info:result,
    //     params:params,
    //     preAnswer:result.preAnswerContent,
    //     frameId:frameId,
    //     noSource:req.query.noSource,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};

/**
 * 长度改成汉字数字
 */
function changeNumToHan(num) {
  var numHan = "";
  switch (num) {
    case 1:
      numHan = "一";
      break;
    case 2:
      numHan = "二";
      break;
    case 3:
      numHan = "三";
      break;
    case 4:
      numHan = "四";
      break;
    case 5:
      numHan = "五";
      break;
    case 6:
      numHan = "六";
      break;
  }
  return numHan;
}


