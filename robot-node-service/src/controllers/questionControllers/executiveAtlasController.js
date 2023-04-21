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

    var data = result.data;
    var hideClass = commonUtil.generateRandomClassName('hideClass');
    var moreId = commonUtil.generateRandomClassName('moreId');
    var boxClass = data.length > 0 ? 'box_execAtlas' : null;
    var tagBody = '<div class="' + boxClass + '">';

    if (data.length > 0) {
      data.forEach(function (item, index) {
        var ifHideClass = index > 1 ? 'none' : 'block';
        var hideClassLine = index > 1 ? hideClass : '';

        tagBody +=
          '<div style="display:' + ifHideClass + '" class="box ' + hideClassLine + '">' +
          '<h3>' + item.managerName + '</h3>';

        if (item.infoList && item.infoList.length > 0) {
          item.infoList.forEach(function (el, i) {

            tagBody +=
              '<ul>' +
              '<li>' +
              '<h5>' + (el.secName || '--') + '</h5>' +
              '<h6 class="num">' + el.secCode + '</h6>' +
              '</li>' +
              '<li>' +
              '<h5>' + el.post + '</h5>' +
              '</li>' +
              '<li>' +
              '<h5 class="num">' + commonUtil.addPerForMin(el.hldAmount, el.hldPercent) + '</h5>' +
              '<h6>持股比例</h6>' +
              '</li>' +
              '</ul>';
          });
        }

        tagBody += '</div>';
      });
    } else {
      tagBody += '<div><ul><li>暂无</li></ul></div>'
    }

    if (data.length > 2) {
      tagBody +=
        '<div id="' + moreId + '" class="box_load" onclick=toolsUtil.showMoreArticle("' + hideClass + '","' + moreId + '",3)>' +
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

    ejs.renderFile("./src/questionView/executiveAtlas.ejs", renderData, function (err, str) {
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

    // res.render("executiveAtlas",
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
