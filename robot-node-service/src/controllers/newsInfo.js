// controller 是直接处理请求的函数集合，函数格式为function(req, res)

import {infoApiService,semanticApiService} from "../service";

module.exports = {
  async apiReportDetail(req, res, next){
    let info = await infoApiService.apiReportDetail(req.query);
    res.json(info);
  },

  async apiNewsDetail(req, res, next){
    let info = await infoApiService.apiNewsDetail(req.query);
    res.json(info);
  },

  async apiBigSearchDetail(req, res, next){
    let info = await semanticApiService.apiBigSearchDetail(req.query);
    res.json(info);
  },
};
