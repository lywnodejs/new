
import {semanticApiService} from "../service";
import reportAnswerController from "./questionControllers/reportAnswerController";

// 智能写作查询接口 赵波 2020.03.06
module.exports = {
  // 查询处理
  async index (req, res, next) {
    let params = req.query;
    params.organization = req.query.appKey;

    // 自由问答 post
    let result = await semanticApiService.writeQuestion(params);
    // console.log(result)
    if (result) {
      // 答案类型
      let type = result.answerResultType;
      if (type === '数据中心答案') {
        let reportResult = await reportAnswerController.renderTemp(req, res, next, result, params);
        if (reportResult) {
          result.apiData = result.data
          result.data = reportResult
        }
        res.json(result);
      } else {
        res.json(result);
      }
    } else {
      res.json({})
    }
  }
};
