import commonUtil from "../../questionView/utils/commonUtil";
import timeUtil from "../../questionView/utils/timeUtil";
import config from "../../config";

let ejs = require("ejs");

// 员工持股 赵波 2019.10.22
module.exports = {
  async renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    let sn = new Date().getTime();

    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      info: result,
      params: params,
      preAnswer: result.preAnswerContent,
      noSource: req.query.noSource,
      commonUtil: commonUtil,
      timeUtil: timeUtil,
      frameId: frameId,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/employeeStockHolding.ejs", renderData, function (err, str) {
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
