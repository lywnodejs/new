import config from "../../config";
let ejs = require("ejs");

// 错误提示
module.exports = {
  async renderTemp(req, res, next, error) {

    let renderData = {
      error: error,
      preAnswer: '',
      noSource: req.query.noSource,
      host: config[process.env.NODE_ENV].host,
      config: config[process.env.NODE_ENV].resource
    };

    ejs.renderFile("./src/questionView/error.ejs", renderData, function (err, str) {
      res.set('Content-Type', 'text/html');
      res.send(str);
    });
  }
}
