const funcitons = require('../modules');
// controller 是直接处理请求的函数集合，函数格式为function(req, res)
module.exports = {
  /**
   * @description web网页转pdf
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  async web_top_pdf(req, res, next) {
    funcitons.renderPdf(req,res);
  }
};
