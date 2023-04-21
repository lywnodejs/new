import config from "../../config";

let ejs = require("ejs");

// 页面跳转答案 赵波 2019.11.14
module.exports = {

  renderTemp(req, res, next, result, params) {
    let frameId = req.query.frameId;
    let sn = (new Date()).getTime();

    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      frameId: frameId,
      noSource: req.query.noSource,
      params: params,
      preAnswer: result.preAnswerContent,
      info: result,
      answerResultType: result.answerResultType,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/urlAnswer.ejs", renderData, function (err, str) {
      // console.log(err)
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
