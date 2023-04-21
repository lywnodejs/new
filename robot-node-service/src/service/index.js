/**
 * Created by lijian on 2018/8/17.
 */
import ClientAxios from '../libs/clientAxios';
import SemanticApiService from './semanticApiService';
import StockAnalysisService from './stockAnalysisService';
import QuotaService from "./quotaService";
import JyService from "./jyService";
import LogService from "./logService";
import NodeService from "./nodeService";
import ReportService from "./reportService";
import InfoApiService from "./infoApiService";
import SemanticDataCenterService from "./semanticDataCenterService";
import EduService from "./eduService";

import config from'../config/index';

// console.log(config[process.env.NODE_ENV])

let client = {
  semanticApiService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].semanticApiService),
  stockAnalysisService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].stockAnalysisService),
  quota:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].quota),
  semanticDataCenterService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].semanticDataCenterService),
  jy:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].jy),
  log:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].logService),
  node:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].nodeService),
  report:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].reportService),
  info:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].infoService),
  eduDomain:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].eduDomain),
}

let semanticApiService = new SemanticApiService.SemanticApiService(client.semanticApiService);
let semanticDataCenterService = new SemanticDataCenterService.SemanticDataCenterService(client.semanticDataCenterService);
let stockAnalysisService = new StockAnalysisService.StockAnalysisService(client.stockAnalysisService);
let quotaService = new QuotaService.QuotaService(client.quota);
let jyService = new JyService.JyService(client.jy);
let logService = new LogService.LogService(client.log);
let nodeService = new NodeService.NodeService(client.node);
let reportService = new ReportService.ReportService(client.report);
let infoApiService = new InfoApiService.InfoApiService(client.info);
let eduService = new EduService.EduService(client.eduDomain);

export {
  semanticApiService,
  stockAnalysisService,
  quotaService,
  jyService,
  nodeService,
  reportService,
  infoApiService,
  semanticDataCenterService,
  logService,
  eduService
}


