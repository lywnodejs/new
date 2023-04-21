import commonUtil from "../../questionView/utils/commonUtil";
import timeUtil from "../../questionView/utils/timeUtil";
import config from "../../config";
import {quotaService} from '../../service'

let ejs = require("ejs");

// 融资融券 赵波 2019.10.18
module.exports = {
  async renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    let sn = new Date().getTime();

    // 取股票行情
    let tMarMargintradeInfo = result.data.tMarMargintradeInfo;
    let symbol = tMarMargintradeInfo.marType + tMarMargintradeInfo.secCode;
    let quotaResult = await quotaService.getSymbolPrice({symbol: symbol});

    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      info: result,
      quotaResult: quotaResult,
      params: params,
      preAnswer: result.preAnswerContent,
      noSource: req.query.noSource,
      commonUtil: commonUtil,
      timeUtil: timeUtil,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/marginBalance.ejs", renderData, function (err, str) {
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
}
