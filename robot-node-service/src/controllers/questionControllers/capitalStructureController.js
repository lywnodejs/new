// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import { semanticApiService, quotaService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  async renderTemp(req, res, next, result, params) {
    // JSON.parse("{t:2,e:s,''}");
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();




    //提取出要用的变量
    var shareStructure = result.data.shareStru ? result.data.shareStru : {};
    var shareholderAmountList = result.data.amount.shareholderAmountList;
    var lastHolder = shareholderAmountList.length > 0 ? shareholderAmountList[0] : {};
    var calendarList = result.data.calendarList;
    var latestCalendar = calendarList.length > 0 ? calendarList[0] : {};

    var tagBody = '';
    var detailId = commonUtil.generateRandomClassName('detail');

    //股东变化用
    var strAmount = '';
    if (!lastHolder) {
      strAmount = '';
    }
    else if (lastHolder.chanOfLast > 10)
      strAmount = '数量增加';
    else if (lastHolder.chanOfLast < -10)
      strAmount = '数量减少';
    else
      strAmount = '数量稳定';

    //解禁股用
    var tagCalendar = '';
    var clsLatestCalendar = 'none'; //若一个月内有解禁信息，则打上“近期大量解禁”标签
    if (latestCalendar && (latestCalendar.listDateTimestamp - new Date().getTime() < 30 * 24 * 3600 * 1000))
      clsLatestCalendar = '';

    var chartId = commonUtil.generateRandomClassName('chart');

    var strLimitedStock = '';
    if (calendarList.length > 0)
      strLimitedStock = '；' + commonUtil.generateDate(latestCalendar.listDate) + '将解禁' + commonUtil.formatNumber(latestCalendar.listAmount * 10e3, '', false) + '股，占总股本的' + (latestCalendar.listAmount / shareStructure.totShare * 100).toFixed(2) + '%';


    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      info: result,
      frameId: frameId,
      chartId: chartId,
      commonUtil: commonUtil,
      params: params,
      noSource: req.query.noSource,
      preAnswer: result.preAnswerContent,
      detailId: detailId,
      strAmount: strAmount,
      clsLatestCalendar: clsLatestCalendar,
      strLimitedStock: strLimitedStock,
      shareStructure: shareStructure,
      lastHolder: lastHolder,
      latestCalendar: latestCalendar,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/capitalStructure.ejs", renderData, function (err, str) {
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
