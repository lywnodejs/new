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

    var data = result.data;
    var hideClass = commonUtil.generateRandomClassName('hideClass');
    var moreId = commonUtil.generateRandomClassName('moreId');
    var tagBody =
      '<div class="box_timeLine box_timeLine_factor">' +
      '<div class="timeLine">' +
      '<ul>';

    if (data.length > 0) {
      data.forEach(function (item, index) {
        var ifHideClass = index > 4 ? 'none' : 'flex';
        var hideClassLine = index > 4 ? hideClass : '';
        tagBody +=
          '<li style="display:' + ifHideClass + '" class="' + hideClassLine + '">' +
          '<dt>' +
          '<b></b>' +
          '<s><i></i></s>' +
          '</dt>' +
          '<dd>' +
          '<div class="space_between">' +
          '<span>' + item.shldName + '</span>' +
          '<span class="date">' + timeUtil.timeChange(item.chanEndTimestamp) + '</span>' +
          '</div>' +
          '<h6>' + (item.relatedPost || '') + (item.relatedName || '') + (item.managerRelation || '') + '</h6>' +
          '<h5>' + (item.chanReason ? '通过' : '') + (item.chanReason || '') + '以每股' + (commonUtil.formatNumber(item.chanPrice) || '--') + '元' + (item.chanAmount > 0 ? '增' : '减') + '持' + (commonUtil.formatNumber(Math.abs(item.chanAmount), '', false) || '--') + '股。</h5>' +
          '</dd>' +
          '</li>';
      });
    } else {
      tagBody +=
        '<li>' +
        '<dt>' +
        '<b></b>' +
        '<s><i></i></s>' +
        '</dt>' +
        '<dd>' +
        '<div class="space_between">' +
        '<span>暂无持股信息变动</span>' +
        '</div>' +
        '</dd>' +
        '</li>';
    }
    tagBody +=
      '</ul>' +
      '</div>' +
      '</div>';

    if (data.length > 5) {
      tagBody +=
        '<div id="' + moreId + '" class="box_load" onclick=toolsUtil.showMoreArticle("' + hideClass + '","' + moreId + '")>' +
        '<a>查看更多</a>' +
        '</div>';
    }



    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      data: tagBody,
      info: result,
      params: params,
      noSource: req.query.noSource,
      preAnswer: result.preAnswerContent,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/shareholdersInOrDe.ejs", renderData, function (err, str) {
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

    // res.render("shareholdersInOrDe",
    //   {
    //     sn:sn,
    //     data:tagBody,
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
