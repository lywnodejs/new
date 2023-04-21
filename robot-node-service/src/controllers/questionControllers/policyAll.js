// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import config from '../../config';
var logger = require('../../utils/logger');
let ejs = require("ejs");

module.exports = {
  //所属题材
  async renderTemp(req, res, next,info) {

    module.exports.policyAll(req, res, next, info);

    // logger.info("用时", {
    //   semanticApi: semanticapiTime,
    //   totalTime: totalTime,
    // });
  },

  policyAll(req, res, next, info) {





    let needJson = req.query.d === "j";
    let renderData = {
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/policyAll.ejs", renderData, function (err, str) {
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



    // res.render("policyAll",
    //   {
    //     host:config[process.env.NODE_ENV].host,
    //     config:config[process.env.NODE_ENV].resource
    //   })
  }

};
