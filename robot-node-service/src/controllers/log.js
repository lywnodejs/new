// controller 是直接处理请求的函数集合，函数格式为function(req, res)

import {logService} from "../service";

module.exports = {
  async save(req, res, next){
    let info = await logService.save(req.query);
    res.json(info);
  },

};
