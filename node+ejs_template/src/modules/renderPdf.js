const path = require('path');

/**
 * @description 生成pdf
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const renderPdf = async (req, res) => {
  console.log(req);
  let { title, url } = req.body;
  if (!title || !url) {
    res.json({ code: 0, status: false, message: '缺少参数' });
    return;
  }
  res.send({
    code: 0,
    status: true,
    data: {
      url: '...',
    },
  });

};

module.exports = renderPdf;
