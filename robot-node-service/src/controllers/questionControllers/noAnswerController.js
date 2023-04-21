// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import config from '../../config';
import commonUtil from '../../questionView/utils/commonUtil';
let ejs = require("ejs");

module.exports = {
  renderTemp(req, res, next, info, params) {
    // JSON.parse("{t:2,e:s,''}");
    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();
    
    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      frameId: frameId,
      info: info,
      params: params,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/noAnswer.ejs", renderData, function (err, str) {
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

    // res.render("noAnswer",
    //   {
    //     sn: sn,
    //     frameId: frameId,
    //     info: info,
    //     params: params,
    //     noSource: req.query.noSource,
    //     preAnswer: info.preAnswerContent,
    //     host: config[process.env.NODE_ENV].host,
    //     config: config[process.env.NODE_ENV].resource
    //   })
  }

};
