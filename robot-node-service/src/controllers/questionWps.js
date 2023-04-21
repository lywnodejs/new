
import {semanticApiService} from "../service";
import reportAnswerController from "./questionControllers/reportAnswerController";

// 金山WPS版入口 赵波 2019.12.18
module.exports = {
  // 查询处理
  async index (req, res, next) {
    let params = req.query;
    params.organization = req.query.appKey || 'appWps';

    // 针对金山智能写作需要调2次接口的处理
    if (req.query.q1 && req.query.q2) {
      // 先去请求第一个问题，以便后端用来识别实体主语
      params.question = req.query.q1;
      let r1 = await semanticApiService.freeQuestion(params);
      // 第一个返回的结果不使用，只做判断用
      if (r1) {
        // console.log(r1)
        // 第一个问题请求返回后，再去请求第二个问题
        params.question = req.query.q2;
      }
    }

    // 自由问答
    let result = await semanticApiService.freeQuestion(params);
    console.log(result)
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
