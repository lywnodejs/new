// controller 是直接处理请求的函数集合，函数格式为function(req, res)

import {logService,semanticApiService,marketPredictionService} from "../service";

module.exports = {
  async save(req, res, next){
    let info = await logService.save(req.query);
    res.json(info);
  },
  async policySearch(req, res, next){
    let info = await semanticApiService.policySearch(req.query);
    res.json(info);
  },
  async home(req, res, next){
    let info = await semanticApiService.home(req.query);
    res.json(info);
  },
  async infinity(req, res, next){
    let info = await semanticApiService.infinity(req.query);
    res.json(info);
  },
  async know(req, res, next){
    let info = await semanticApiService.know(req.query);
    res.json(info);
  },
  async clientKnow(req, res, next){
    let info = await semanticApiService.clientKnow(req.query);
    res.json(info);
  },
  async knowType(req, res, next){
    let info = await semanticApiService.knowType(req.query);
    res.json(info);
  },
  async marketPrediction(req, res, next){
    let info = await marketPredictionService.getycDate(req.query);
    res.json(info);
  },

};
