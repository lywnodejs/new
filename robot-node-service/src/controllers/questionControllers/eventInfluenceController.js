import { semanticApiService, quotaService } from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
let ejs = require("ejs");

// 事件影响
module.exports = {
  // 事件影响
  async eventInfluence(req, res, next) {
    let params = {}
    //获取行业推荐答案
    let info = await semanticApiService.apiFixQuestion(params);

    if (info.answerResultType !== "事件影响") {
      res.send("无法回答");
    } else {
      module.exports.renderTemp(req, res, next, info, params)
    }
  },

  async renderTemp(req, res, next, info, params) {
    // console.log(info);
    if (info.data === undefined) {
      res.send("没有数据");
      return;
    }

    let frameId = req.query.frameId;
    let sn = (new Date()).getTime();

    let stocks = info.data.stocks || [], //股票
      industries = info.data.industries || []; //行业

    let symbols = '';
    let stockLen = stocks.length;
    if (stockLen > 0) {
      stocks.forEach(function (item) {
        symbols += item.marketType + "_" + item.stockCode + ","
      });
    }

    // 取行情
    let quotaResult = await quotaService.getQuota({ symbol: symbols });

    let tempData = [];
    if (quotaResult) {
      for (let i = 0; i < quotaResult.items.length; i++) {
        let item = {};
        item.stocks = quotaResult.items[i];
        item.reason = info.data.reasonDocMap[quotaResult.items[i].stkCode];
        tempData.push(item);
      }
    }

    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      frameId: frameId,
      tempData: tempData,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      industries: industries,
      price: quotaResult,
      params: params,
      info: info,
      commonUtil: commonUtil,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/eventInfluence.ejs", renderData, function (err, str) {
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

    // res.render("eventInfluence",
    // {
    //   sn:sn,
    //   frameId:frameId,
    //   tempData:tempData,
    //   noSource:req.query.noSource,
    //   preAnswer:info.preAnswerContent,
    //   industries:industries,
    //   price:price,
    //   params:params,
    //   info:info,
    //   commonUtil:commonUtil,
    //   host:config[process.env.NODE_ENV].host,
    //   config:config[process.env.NODE_ENV].resource
    // })
  }

};
