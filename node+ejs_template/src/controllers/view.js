module.exports = {
  /**
   * @description web网页转pdf
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  index(req, res, next) {
    res.render('index',{
      title:'test'
    })
  }
};
