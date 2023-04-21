// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService } from '../../service/index';
import generateStockHolderUtil from '../../questionView/utils/generateStockHolderUtil';
import config from '../../config';
import commonUtil from "../../questionView/utils/commonUtil";
import timeUtil from "../../questionView/utils/timeUtil";
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {

  renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    var tagBody = commonForRiskInfo(result, false);

    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: tagBody,
      info: result,
      params: params,
      preAnswer: result.preAnswerContent,
      noSource: req.query.noSource,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/companyRiskInfo.ejs", renderData, function (err, str) {
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

    // res.render("companyRiskInfo",
    //   {
    //     sn:sn,
    //     data:tagBody,
    //     info:result,
    //     params:params,
    //     preAnswer:result.preAnswerContent,
    //     noSource:req.query.noSource,
    //     frameId:frameId,
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};

function commonForRiskInfo(result, ifHasPushing) {
  var data;
  // debugger
  if (ifHasPushing) {
    if (result.data.hasOwnProperty('list')) {
      data = JSON.parse(result.data.list[0].messageContent);
    } else {
      data = JSON.parse(result.data[0].messageContent);
    }

  } else {
    data = result.data;
  }
  var ratingInfo = '';
  var ratingDesc = data.ratingDesc;
  var riskNotices = data.riskNotices;
  var moreId = commonUtil.generateRandomClassName('moreId');
  var noticeList = commonUtil.generateRandomClassName('noticeList');
  var secCode = data.secCode;
  var marType = data.marType;
  var cp = 1;
  var tagBody = '<div class="box_risk">';
  if (ratingDesc) {
    tagBody += '<h5>' + ratingDesc + '</h5>';
  }
  if (riskNotices.length > 0) {
    tagBody +=
      '<div class="hd"><i></i></div>' +
      '<div class="box_timeLine box_timeLine_factor">' +
      '<div class="timeLine">' +
      '<ul class="' + noticeList + '">';
    riskNotices.forEach(function (item, index) {
      tagBody +=
        '<li onclick="showPDF(\'' + item.annTitle + '\',\'' + item.annUrl + '\')">' +
        '<dt>' +
        '<b></b>' +
        '<s><i></i></s>' +
        '</dt>' +
        '<dd>' +
        '<div class="space_between">' +
        '<span class="PDFUrlBtn">' + item.noticeType + '</span>' +
        '<span class="date">' + timeUtil.timeChange(item.pubAt, '/') + '</span>' +
        '</div>' +
        '<h5 class="b_fa">' + item.annTitle + '</h5>' +
        '</dd>' +
        '</li>';
    });
    tagBody +=
      '</ul>' +
      '</div>' +
      '</div>';
  } else {
    tagBody += '<h5>该公司近3年暂无重大风险类公告</h5>';
  }

  if (data.hasNextPage) {
    tagBody +=
      '<div id="' + moreId + '" class="box_load">' +
      '<a onclick="moreRiskNotices(\'' + moreId + '\',\'' + noticeList + '\',\'' + secCode + '\',\'' + marType + '\',\'' + cp + '\')">查看更多</a>' +
      '</div>' +
      '<div class="spinner2 spinner-container-content" style="display:none;">' +
      '<div class="spinner-container container1">' +
      '<div class="circle1"></div>' +
      '<div class="circle2"></div>' +
      '<div class="circle3"></div>' +
      '<div class="circle4"></div>' +
      '</div>' +
      '<div class="spinner-container container2">' +
      '<div class="circle1"></div>' +
      '<div class="circle2"></div>' +
      '<div class="circle3"></div>' +
      '<div class="circle4"></div>' +
      '</div>' +
      '<div class="spinner-container container3">' +
      '<div class="circle1"></div>' +
      '<div class="circle2"></div>' +
      '<div class="circle3"></div>' +
      '<div class="circle4"></div>' +
      '</div>' +
      '</div>';
  }

  return tagBody;

}
