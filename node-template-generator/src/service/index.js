/**
 * Created by lijian on 2018/8/17.
 */
import ClientAxios from '../libs/clientAxios';
import ReportCompositeService from './reportCompositeService';
import SemanticApiService from './semanticApiService';
import MarketPredictionService from './marketPredictionService';
import AiApiService from './aiApiService';
import SemanticCompositeService from './semanticCompositeService';
import MetadataDimDwService from './metadataDimDwService';
import SemanticDatacenterServic from './semanticDatacenterServic';
import DwDbService from './dwDbService';
import SearchTemplateService from './searchTemplateService';

import StockAnalysisService from './stockAnalysisService';
import QuotaService from "./quotaService";
import LogService from "./logService";
import FinancialStatementService from "./financialStatementService";
import FinancialThemDwService from "./financialThemDwService";
import config from'../config/index';

//行业研报生成
import AutoReportIndustryService from "./autoReportIndustryService";


// console.log(config[process.env.NODE_ENV])


let client = {
  semanticApiService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].semanticApiService),
  marketPredictionService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].marketPredictionService),
  reportCompositeService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].reportCompositeService),
  searchTemplateService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].host),
  semanticCompositeService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].semanticCompositeService),
  stockAnalysisService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].stockAnalysisService),
  semanticDatacenterServic:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].semanticDatacenterServic),
  metadataDimDwService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].metadataDimDwService),
  quota:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].quota),
  dwDbService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].dwDbService),

  autoReportIndustry:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].autoReportIndustry),
  financeStatementeService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].financeStatementeService),
  financeThemDwService:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].financeThemDwService),
  log:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].logService),
  aiApi:new ClientAxios.ClientAxios(config[process.env.NODE_ENV].aiApiService),
}

let semanticApiService = new SemanticApiService.SemanticApiService(client.semanticApiService);
let marketPredictionService = new MarketPredictionService.marketPredictionService(client.marketPredictionService);
let metadataDimDwService = new MetadataDimDwService.MetadataDimDwService(client.metadataDimDwService);
let semanticDatacenterServic = new SemanticDatacenterServic.SemanticDatacenterServic(client.semanticDatacenterServic);
let semanticCompositeService = new SemanticCompositeService.SemanticCompositeService(client.semanticCompositeService);
let reportCompositeService = new ReportCompositeService.ReportCompositeService(client.reportCompositeService);
let searchTemplateService = new SearchTemplateService.SearchTemplateService(client.searchTemplateService);
let dwDbService = new DwDbService.DwDbService(client.dwDbService);
let stockAnalysisService = new StockAnalysisService.StockAnalysisService(client.stockAnalysisService);
let quotaService = new QuotaService.QuotaService(client.quota);
let logService = new LogService.LogService(client.log);
let aiApiService = new AiApiService.AiApiService(client.aiApi);
let financialStatementService = new FinancialStatementService.financialStatementService(client.financeStatementeService);
let financialThemDwService = new FinancialThemDwService.FinancialThemDwService(client.financeThemDwService);
//行业研报生成
let autoReportIndustryService = new AutoReportIndustryService.AutoReportIndustryService(client.autoReportIndustry);

export {
    searchTemplateService,
    reportCompositeService,
    semanticApiService,
    semanticDatacenterServic,
    semanticCompositeService,
    stockAnalysisService,
    quotaService,
    financialStatementService,
    financialThemDwService,
    autoReportIndustryService,
    logService,
    metadataDimDwService,
    aiApiService,
    dwDbService,
    marketPredictionService
}

