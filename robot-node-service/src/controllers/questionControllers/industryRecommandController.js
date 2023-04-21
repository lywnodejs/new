import commonUtil from '../../questionView/utils/commonUtil';
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

// 行业推荐
module.exports = {
  async renderTemp(req, res, next, info, params) {
    if (info.data === undefined) {
      res.send("没有数据");
      return;
    }

    let frameId = req.query.frameId;
    var sn = (new Date()).getTime();

    // console.log(info)
    var listLong = info.data.hasOwnProperty('longRecommendIndustries') ? info.data.longRecommendIndustries.entries : [];
    var listShort = info.data.hasOwnProperty('shortRecommendIndustries') ? info.data.shortRecommendIndustries.entries : [];
    let totalTime = new Date().getTime() - sn;

    let needJson = req.query.d === "j";
    let renderData = {
      sn: sn,
      frameId: frameId,
      info: info,
      commonUtil: commonUtil,
      noSource: req.query.noSource,
      preAnswer: info.preAnswerContent,
      listLong: listLong,
      listShort: listShort,
      params: params,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/industryRecommand.ejs", renderData, function (err, str) {
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

    // res.render("industryRecommand",
    //   {
    //     sn: sn,
    //     frameId: frameId,
    //     info: info,
    //     commonUtil: commonUtil,
    //     noSource: req.query.noSource,
    //     preAnswer: info.preAnswerContent,
    //     listLong: listLong,
    //     params: params,
    //     listShort: listShort,
    //     host: config[process.env.NODE_ENV].host,
    //     config: config[process.env.NODE_ENV].resource
    //   })

    logger.info("用时", {
      totalTime: totalTime,
    });
  }

};
