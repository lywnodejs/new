import commonUtil from "../../questionView/utils/commonUtil";
import timeUtil from "../../questionView/utils/timeUtil";
import config from "../../config";
import {quotaService, semanticApiService} from "../../service";

let ejs = require("ejs");

// 财务数据 赵波 2019.10.24
module.exports = {
  /**
   * 财务数据
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  async financeReport (req, res, next) {
    let result = await semanticApiService.getFinanceReport(req.query);
    // console.log(result)
    res.json(result)
  },

  async renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    let sn = new Date().getTime();

    // 取股票行情
    let property = commonUtil.getPropertyByEntity(result.questionAnalyse[0].entity);
    let marketType = property.marketType,
      stockCode = property.code;
    let quotaResult = await quotaService.getSymbolPrice({symbol: marketType+stockCode});

    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      info: result,
      params: params,
      quotaResult: quotaResult,
      preAnswer: result.preAnswerContent,
      noSource: req.query.noSource,
      commonUtil: commonUtil,
      timeUtil: timeUtil,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/financialMainIndex.ejs", renderData, function (err, str) {
      console.log(err)
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
