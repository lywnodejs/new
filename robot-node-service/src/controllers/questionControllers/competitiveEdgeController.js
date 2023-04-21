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
    var randomTime = new Date().getTime();
    var moreId = 'moreId' + randomTime;
    var item;
    var temp = "";
    var eventLength = result.data.list.length;


    var ifShowD = 'show';
    var hideClass = commonUtil.generateRandomClassName('hideClass');
    for (var i = 0; i < reportList.length; i++) {
      item = reportList[i];
      var symbol = commonUtil.getSymbolByEntity(result.questionAnalyse[0].entity, false);
      var sourceFrom = item.docType;
      var analyseResultsList = item.analyseResults,
        summary = item.title,
        organization = sourceFrom === "weixin" ? item.weChatName : item.organization,
        author = item.author,
        ratingName = item.ratingName ? item.ratingName : '';
      var ifEventShow = i == 0 ? 'show' : '';
      var analyseTxt = reportList[i].analyseFlags[0];
      var analyseResultsContent = analyseResultsList[symbol + analyseTxt];
      var lineClass = commonUtil.generateRandomClassName('hideArticle');
      var ifHideMore = i > 1 ? "none" : "block";
      var ifHideClass = i > 1 ? hideClass : "";

      temp += "<div style='display:" + ifHideMore + "' class='" + ifHideClass + " box_show box_show_btn " + lineClass + "'>";
      temp += "<h4 class='space_between'>";
      temp += "<span>" + organization + " | " + author + "</span>";
      temp += "<span class='date'>" + commonUtil.changeTime(item.publishAt) + "</span>";
      temp += "</h4>";
      temp += "<h5 class='show_row5'>" + analyseResultsContent.replace(/\n/g, '<br>') + "</h5>";
      if (analyseResultsContent.length < 120) {
        ifShowD = 'hide';
      }
      temp += "<a class='" + ifShowD + " a_more a" + lineClass + "' onclick=showMoreh5AndShowUp('" + lineClass + "')>展开<i class='icon-arrowD'></i></a>";
      temp += "<a style='display:none;' class='a_more aShow" + lineClass + "' onclick=hideMoreh5AndShowUp('" + lineClass + "')>收起<i class='icon-arrowT'></i></a>";
      temp += "</div>";
    }
    if (reportList.length > 2) {
      temp += "<div id=" + moreId + " class='box_load'><a onclick=toolsUtil.showMoreArticle('" + hideClass + "','" + moreId + "')>点击加载更多</a></div>";
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

    ejs.renderFile("./src/questionView/competitiveEdge.ejs", renderData, function (err, str) {
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

    // res.render("competitiveEdge",
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
