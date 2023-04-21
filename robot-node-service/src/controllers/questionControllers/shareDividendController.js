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

    var list = result.data;
    var len = list.length;
    var temp = '';

    var recentPlan;
    if (len > 0) {
      recentPlan = list.shift();

      //最近分红方案
      var tagRecent =
        '<div class="box_hd2 box_hd2_red">' +
        '<span>最新分红配股方案</span>' +
        '<b><i class="i_t"></i><i class="i_b"></i></b>' +
        '<em class="date">' + commonUtil.changeTime(recentPlan.quarterEndAt) + '</em>' +
        '</div>' +
        '<h5>分红方案:' + recentPlan.boardInstruction.replace(/\n/g, '<br>') + '</h5>';
      if (recentPlan.aStockRecordDay || recentPlan.aStockExdividendDay || recentPlan.aStockPaymentDay) {
        tagRecent += '<div class="box_show_ol box_show_ol3 box_ol_data">' +
          '<div class="linkTop_half"></div>' +
          '<ol>' +
          '<li>股权登记日</li>' +
          '<li>除权日</li>' +
          '<li>红利发放日</li>' +
          '</ol>' +
          '<ul>' +
          '<li>' +
          '<h6>' + commonUtil.generateDate(recentPlan.aStockRecordDay) + '</h6>' +
          '</li>' +
          '<li>' +
          '<h6>' + commonUtil.generateDate(recentPlan.aStockExdividendDay) + '</h6>' +
          '</li>' +
          '<li>' +
          '<h6>' + commonUtil.generateDate(recentPlan.aStockPaymentDay) + '</h6>' +
          '</li>' +
          '</ul>' +
          '<div class="clear_float"></div>' +
          '</div>';
      }

      //历史方案
      var tagHistory = '';
      var loop = '';
      len = list.length;
      if (len > 0) {
        tagHistory =
          // <!-- 带背景色的标题框蓝色-->
          '<div class="box_hd2 box_hd2_blue">' +
          '<span>分红配股历史</span>' +
          '<b><i class="i_t"></i><i class="i_b"></i></b>' +
          '</div>' +
          '<div class="box_show_ol box_show_ol3 box_ol3_dividends">' +
          '<ol>' +
          '<li>分红方案</li>' +
          '<li>每股收益</li>' +
          '<li>分红年度</li>' +
          '</ol>';

        for (var i = 0; i < len && i < 4; i++) {
          var item = list[i];
          //收益样式
          var clsProfit = '';
          if (item.basicEps > 0)
            clsProfit = 't_red';
          else if (item.basicEps < 0)
            clsProfit = 't_green';
          loop +=
            '<ul>' +
            '<li>' +
            '<h5>' + item.boardInstruction + '</h5>' +
            '</li>' +
            '<li>' +
            '<h5 class="' + clsProfit + '">' + commonUtil.fixed2(item.basicEps) + '</h5>' +
            '</li>' +
            '<li>' +
            '<h6>' + commonUtil.changeTime(item.quarterEndAt) + '</h6>' +
            '</li>' +
            '</ul>'
        }
        tagHistory = tagHistory + loop + '<div class="clear_float"></div></div>';
      }
      temp = tagRecent + tagHistory;
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

    ejs.renderFile("./src/questionView/shareDividend.ejs", renderData, function (err, str) {
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

    // res.render("shareDividend",
    // {
    //   sn:sn,
    //   data:temp,
    //   info:result,
    //   params:params,
    //   noSource:req.query.noSource,
    //   preAnswer:result.preAnswerContent,
    //   frameId:frameId,
    //   host:config[process.env.NODE_ENV].host,
    //   config:config[process.env.NODE_ENV].resource
    // })
  }

};
