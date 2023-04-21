// controller 是直接处理请求的函数集合，函数格式为function(req, res)

import {quotaService} from "../service";

module.exports = {
  async stockQuota(req, res, next){

    let info = await quotaService.getQuota(req.query);
    res.json(info);
  },

  async getKline(req, res, next){

    let info = await quotaService.getkline(req.query);
    res.json(info);
  },

  async getSymbolPrice(req, res, next){

    let info = await quotaService.getSymbolPrice(req.query);
    res.json(info);
  },

};
