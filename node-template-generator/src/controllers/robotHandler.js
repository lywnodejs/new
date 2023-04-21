import toolsUtil from "../utils/toolsUtil";
import commonUtil from "../utils/commonUtil";
import handlerUtil from "../utils/handlerUtil"
import format from "../utils/format"
import comUtil from "../utils/com-util";
import {
    semanticDatacenterServic,
    semanticApiService,
    quotaService,
    stockAnalysisService,
    financialThemDwService,
    reportCompositeService
} from "../service";
import _ from "underscore";
import reportSearchHandler from "./reportSearchHandler";


let robotHandler = {

    /**
     * 小e分析
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHandler(data) {
        let result;
        data.disName = ""

        if (data.symbol) {
            let quota = await quotaService.getSymbolPrice({symbol: data.symbol});
            data.disName = quota.stkName;
        } else {
            data.symbol = "sz000001";
            data.disName = "平安银行"
        }

        if (!data.isDefaultStock) {
            if (data.selectedStock && data.selectedStock.length > 0) {
                data.symbol = data.selectedStock[0].baseName;
                data.disName = data.selectedStock[0].disName;
            }
        }


        // if(data.selectedStock){
        //   data.symbol = data.selectedStock[0].baseName;
        // }

        switch (data.id) {
            case 1301:
                result = await this.robotAnalysHandlerRating(data);
                break;
            case 1302:
                result = await this.robotAnalysCompanyInfo(data);
                break;
            case 1303:
                result = await this.robotAnalysCompanySummery(data);
                break;
            case 1304:
                result = await this.robotAnalysTop10StockHolder(data, 1);
                break;
            case 1305:
                result = await this.robotAnalysTop10StockHolder(data, 2);
                break;
            case 1306:
                result = await this.robotAnalysHolderAddReduce(data);
                break;
            case 1307:
                result = await this.robotAnalysHolderChange(data, 1);
                break;
            case 1308:
                result = await this.robotAnalysHolderChange(data, 2);
                break;
            case 1309:
                result = await this.robotAnalysProsperity(data, "行业景气度-一键研报");
                break;
            case 1310:
                result = await this.robotAnalysProsperity(data, "标的稀缺性-一键研报");
                break;
            case 1311:
                result = await this.robotAnalysExecutive(data);
                break;
            case 1312:
                result = await this.robotAnalysConcept(data);
                break;
            case 1313:
                result = await this.robotAnalysShare(data, "new");
                break;
            case 1314:
                result = await this.robotAnalysShare(data, "old");
                break;
            case 1315:
                result = await this.robotAnalysSenior(data, "高管有");
                break;
            case 1316:
                result = await this.robotAnalysSenior(data, "参股公司是");
                break;
            case 1317:
                result = await this.robotAnalysSenior(data, "股本结构是", 1);
                break;
            case 1318:
                result = await this.robotAnalysSenior(data, "股本结构是", 2);
                break;
            case 1319:
                result = await this.robotAnalysComment(data);
                break;
            case 1320:
                result = await this.robotAnalysSenior(data, "经营分析");
                break;
            case 1321:
                result = await this.robotAnalysSenior(data, "竞争优势");
                break;
            case 1322:
                result = await this.robotStockHeader(data, 1);
                break;
            case 1323:
                result = await this.robotStockHeader(data, 2);
                break;
            case 1324:
                result = await this.robotStockHeader(data, 3);
                break;
            case 1401:
                result = await this.robotAnalysHandlerMoneyFlowRanking(data);
                break;
            case 1402:
                result = await this.robotAnalysHandlerMoneyFlow(data, 1);
                break;
            case 1403:
                result = await this.robotAnalysHandlerMoneyFlow(data, 2);
                break;
            case 1404:
                result = await this.robotAnalysHandlerMarginTrading(data);
                break;
            case 1405:
                result = await this.robotAnalysHandlerMarginTradingTop(data, 'margin');
                break;
            case 1406:
                result = await this.robotAnalysHandlerMarginTradingTop(data, 'trading');
                break;
            case 1407:
                result = await this.robotAnalysHandlerMobility(data);
                break;
            case 1408:
                result = await this.robotAnalysHandlerMobilityList(data, 'high');
                break;
            case 1409:
                result = await this.robotAnalysHandlerMobilityList(data, 'low');
                break;
            case 1501:
                result = await this.robotAnalysHandlerEventList(data, '资讯是');
                break;
            case 1502:
                result = await this.robotAnalysHandlerEventList(data, '公告是');
                break;
            case 1503:
                result = await this.robotAnalysHandlerEventList(data, '研报是');
                break;
            case 1504:
                result = await this.robotAnalysHandlerRiskList(data, '公司回购');
                break;
            case 1505:
                result = await this.robotAnalysHandlerRiskList(data, '风险提示');
                break;
            case 1506:
                result = await this.robotAnalysHandlerRiskList(data, '股权激励是', 1);
                break;
            case 1507:
                result = await this.robotAnalysHandlerPerformance(data);
                break;
            case 1508:
                result = await this.robotAnalysHandlerRiskList(data, '业绩快报是');
                break;
            case 1509:
                result = await this.robotAnalysSenior(data, "个股限售股解禁", 1);
                break;
            case 1510:
                result = await this.robotAnalysSenior(data, "个股限售股解禁", 2);
                break;
            case 1511:
                result = await this.robotAnalysHandlerRiskList(data, '股权激励是', 2);
                break;
            case 5007:
                result = await this.robotAnalysHandlerIndex(data);
                break;
            case 5009: //小e分析，数据是
                result = await this.robotAnalysisHandlerDataIs(data);
                break;
            case 5013: //小e分析，数据是
                result = await reportSearchHandler.researchHandler(data);
                break;
            default:
                result = await this.robotAnalysHandlerRating(data);
        }
        return result;
    },

    /**
     * 股权质押
     * @param data
     * @param type 1 质押头部 2 触达预警和平仓的质押  3 当前存续的股权质押
     * @returns {Promise<*>}
     */
    async robotStockHeader(data, type) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz002424";
            code = "002424";
            marketType = "sz";
        }
        // code = "002424";
        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }


        let reqparams = {};
        reqparams.marType = marketType;
        reqparams.secCode = code;
        let info = await semanticApiService.robotStock(reqparams);
        let template = "robotStockHeader";
        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            return {code: -1, message: "暂无数据!", templateType: params.templateType}
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            type: type,
            runtimeParams: reqparams,
            dataType: data.dataTypes,
            params: params,
        };
        return result;
    },
    /**
     * 小e点评
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysComment(data) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "分析";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-小e点评';

        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "robotComment";


        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            runtimeParams: reqparams,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 大股东增减持
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHolderAddReduce(data, type, sn) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            data.disName = "平安银行";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "股东增减持";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.subjectRawValue = data.disName;
        reqparams.question = "股东增减持";

        reqparams.sourceFrom = '报告平台-小e组件-股东增减持';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "companyTopHolderAddReduce";


        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            runtimeParams: reqparams,
            dataType: data.dataTypes,
            params: params,
            type: type,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 高管汇总
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysSenior(data, type, sn) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = type;
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;

        reqparams.sourceFrom = '报告平台-小e组件-' + 'type';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "seniorList";
        if (type == "高管有") {
            template = "seniorList";
        } else if (type == "参股公司是") {
            template = "seniorGraphList";
        } else if (type == "股本结构是") {
            if (sn == 2) {
                template = "structureStock";
            } else {
                template = "structureStockList";
            }
        } else if (type == "个股限售股解禁") {
            if (sn == 1) {
                template = "restrictedStock";
            } else {
                template = "restrictedStockList";
            }
        } else if (type == "竞争优势") {
            template = "competitiveEdge";
        } else if (type == "经营分析") {
            template = "competitiveEdge";
        } else if (type == "股东增减持") {
            template = "companyTopHolderAddReduce";
        }


        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            runtimeParams: reqparams,
            dataType: data.dataTypes,
            params: params,
            type: type,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 业绩预告
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHandlerPerformance(data) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "业绩预告是";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;

        reqparams.sourceFrom = '报告平台-小e组件-业绩预告是';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "performanceList";


        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            runtimeParams: reqparams,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        return result;
    },

    /**
     * 公司回购，风险提示，股权激励
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHandlerRiskList(data, type, sn) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = type;
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-业绩预告是' + 'type';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "riskList";
        if (type == "风险提示") {

        } else if (type == "公司回购") {
            template = "companyBuy"
        } else if (type == "业绩快报是") {
            template = "performanceBulletin"
        } else if (type == "股权激励是") {
            if (sn == 1) {
                template = "incentive"
            } else {
                template = "riskDetail"
            }
        }

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            type: type,
            runtimeParams: reqparams,
            dataType: data.dataTypes,
            params: params,
            toolsUtil: toolsUtil,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },


    /**
     * 个股资讯
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHandlerEventList(data, type) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = type;
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-' + 'type';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "eventList";


        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            runtimeParams: reqparams,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 分红控股
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysShare(data, type) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "分红配股是";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-分红配股是';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "shareBonusList";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            type: type,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 行业概念
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysConcept(data) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "行业概念-一键研报";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        let info = {data: []};
        let template = "industryConcept";


        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            runtimeParams: reqparams,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },
    /**
     * 流动性排行
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHandlerMobilityList(data, type) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }

        let tempStock = {
            marType: marketType,
            secCode: code
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "个股流动性";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-个股流动性';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "mobilityList";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            type: type,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 流动性排行
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHandlerMobility(data) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }

        let tempStock = {
            marType: marketType,
            secCode: code
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "个股流动性";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-个股流动性';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "mobility";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },
    /**
     * 融资排行
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHandlerMarginTradingTop(data, type) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }

        let tempStock = {
            marType: marketType,
            secCode: code
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "两融余额是";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-两融余额是';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "marginTradingTop";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            type: type,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },


    /**
     * 两融排行
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHandlerMarginTrading(data) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }


        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }

        let tempStock = {
            marType: marketType,
            secCode: code
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "两融余额是";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-两融余额是';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "marginTrading";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 行业景气度,标的稀缺性
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysExecutive(data) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }


        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }

        let tempStock = {
            marType: marketType,
            secCode: code
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "高管变动";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-高管变动';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "executive";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },
    /**
     * 行业景气度,标的稀缺性
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysProsperity(data, type) {


        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }


        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }

        let tempStock = {
            marType: marketType,
            secCode: code
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = type;
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-'+type;
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "industryProsperity";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            type: type,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },
    /**
     * 股东人数变化
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHolderChange(data, index) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }


        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }

        let tempStock = {
            marType: marketType,
            secCode: code
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "股东人数变化是";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-股东人数变化是';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "companyHolderChange";
        if (index == 2) {
            template = "companyHolderSpeech";
        }

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        info.index = index;
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 十大股东
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysTop10StockHolder(data, index) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }


        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }

        let tempStock = {
            marType: marketType,
            secCode: code
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "股东是";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-股东是';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "companyTopHolder";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        info.index = index;
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 公司概况
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysCompanySummery(data) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }


        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }

        let tempStock = {
            marType: marketType,
            secCode: code
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "公司介绍";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-公司介绍';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "companySummery";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 公司简介
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysCompanyInfo(data) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }


        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }

        let tempStock = {
            marType: marketType,
            secCode: code
        }


        let reqparams = {};
        reqparams.subjectCode = code;
        reqparams.subjectMarket = marketType;
        reqparams.predicateType = "公司简介-一键研报";
        reqparams.subjectType = "股票";
        reqparams.subjectName = data.disName;
        reqparams.sourceFrom = '报告平台-小e组件-公司简介-一键研报';
        let info = await semanticApiService.apiQaQuestion(reqparams);
        let template = "companyInfo";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 小e分析估值评级
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHandlerRating(data) {

        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }

        // 先获取当前时间
        let curDate = (new Date()).getTime();
        // 将半年的时间单位换算成毫秒
        let halfYear = 365 / 2 * 24 * 3600 * 1000;
        let pastResult = curDate - halfYear;  // 半年前的时间（毫秒单位）

        // 日期函数，定义起点为半年前
        let pastDate = new Date(pastResult);

        let info = await semanticApiService.getInfomationMes({
            begin:pastDate.getTime(),
            facetFields: 'ratingResult',
            title2stocks: code,
            facetSize: '10',
            reportTypes: '公司研究',
            cp: '1',
            ps: '10'
        });

        let template = "valuationGrade";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        let stockLevel = '';
        let yRatingArr = [];
        let xRatingName = [];
        let ratingPaint;
        if (info.data.hasOwnProperty('facetResults')) {
            let facetResults = info.data.facetResults;
            if (facetResults && facetResults.length > 0 && facetResults[0] && facetResults[0].totalCount !== 0 && facetResults[0].entries.length > 0) {
                //有数据
                let colors = ['#D4463E', '#D86838', '#DE9246', '#C3CE4B', '#50A84B', '#9254DE'];
                let xAxis = ['买入', '增持', '中性', '减持', '卖出'];
                let facetResultsVO = facetResults[0];
                let entries = facetResultsVO.entries;
                if (facetResultsVO.totalCount <= 5) {
                    stockLevel = '机构关注度较低'
                }
                if (facetResultsVO.totalCount > 5 && facetResultsVO.totalCount <= 20) {
                    stockLevel = '机构关注度一般'
                }
                if (facetResultsVO.totalCount > 20) {
                    stockLevel = '机构关注度较高'
                }

                ratingPaint = '近半年有' + facetResultsVO.totalCount + '篇研报，' + stockLevel;


                let columnDataMap = new Map();
                for (let i = 0; i < xAxis.length; i++) {
                    columnDataMap.set(xAxis[i], 0);
                }
                for (let i = 0; i < entries.length; i++) {
                    let entriesVO = entries[i];
                    columnDataMap.set(entriesVO.term, entriesVO.count);
                }

                for (let i = 0; i < xAxis.length; i++) {
                    yRatingArr.push({y: columnDataMap.get(xAxis[i]), color: colors[i]});
                    xRatingName.push(xAxis[i]);
                }

                var arrMax = Math.max.apply(null, yRatingArr);
                if (arrMax <= 0) {
                    arrMax = 1
                }
            } else {
                //无数据
                stockLevel = '机构关注度较低';
                if (data.hasOwnProperty('setIndexData')) {
                    let showData = data.setIndexData;
                    if (showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1) {
                        info = showData.replateContent;
                        template = 'text';
                        params = handlerUtil.getTemplateConfig(template);
                    }
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }

        let datas = {
            chartData: {
                yRatingArr: [{
                    type: "column",
                    data: yRatingArr
                }],
                xRatingName: xRatingName
            },
            textValue: ratingPaint
        };


        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            datas: datas,
            ratingPaint: ratingPaint,
            arrMax: arrMax,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;

    },

    /**
     * 小e分析北上资金流入排名
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHandlerMoneyFlowRanking(data) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }


        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }


        let tempStock = {
            marType: marketType,
            secCode: code
        }


        let info = await semanticDatacenterServic.getStockNorthMoney(tempStock);
        let template = "stockMoneyFlowRank";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 小e北上资金列表
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHandlerMoneyFlow(data, type) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }


        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }

        let temp = {
            capitalFlowType: "北上近20个交易日",
            netFlowType: type
        }
        let info = await semanticDatacenterServic.getNorthMoney(temp);

        let template = "stockMoneyFlow";

        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (!info.hasOwnProperty('data')) {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    return {code: -1, message: "暂无数据!", templateType: params.templateType}
                }
            }
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 小e分析财务数据是
     * @param data
     * @returns {Promise<*>}
     */
    async robotAnalysHandlerIndex(data) {
        let queryParams = {
            "indu": 0,
            "induAverage": 0,
            "induRank": 0,
            "secName": 0,
            "timePeriod": 0,
            "orgKey": [],
            "indicatorName": []
        };

        //选择了实体
        if (data.selectedStock && data.selectedStock.length > 0) {
            for (var i = 0; i < data.selectedStock.length; i++) {
                queryParams.orgKey.push(data.selectedStock[i].orgKey);
            }
        } else { //没有选择实体
            if (commonUtil.stringIsNotEmpty(data.orgKeys)) { //有动参，设置为动参
                var orgKeys = data.orgKeys;
                queryParams.orgKey = orgKeys.split(',');
            } else { //没有选择实体，且没有动参，设置默认公司和机构：中国联通
                queryParams.orgKey.push("10000023");
            }
        }
        //选择了指标
        if (data.selectedFinancialIndex && data.selectedFinancialIndex.length > 0) {
            for (var i = 0; i < data.selectedFinancialIndex.length; i++) {
                queryParams.indicatorName.push(data.selectedFinancialIndex[i].name);
            }
        } else { //没有设置指标，看是否有动参
            if (commonUtil.stringIsNotEmpty(data.financialEntity)) { //有动参，设置为动参
                var financialEntity = data.financialEntity;
                queryParams.indicatorName = financialEntity.split(',');
            } else {
                queryParams.indicatorName.push("应收账款");
            }
        }

        //指定时间
        if (data.timeRangeType == 3 && data.timeSeries && data.timeSeries.length > 0) {
           // queryParams.startAt = data.timeSeries[0];
            queryParams.endAt = data.timeSeries[0];
        } else { //任意时间
            if (commonUtil.stringIsNotEmpty(data.endAt)) { //有动参，设置为动参
               // queryParams.startAt = data.endAt;
                queryParams.endAt = data.endAt; //时间点，非时间段，所以起止时间是一样的，取endAt
            } else { //无动参，设置为当前时间
                //queryParams.startAt = format.formatTime(Date.now(), "yyyyMMdd");
                queryParams.endAt = format.formatTime(Date.now(), "yyyyMMdd");
            }
        }

        let showGroup = data.showGroup;
        let isShowStockName = false;
        let isShowIndustry = false;
        let isShowTime = false;
        let isShowIndustryRank = false;
        let isShowIndustryMeanValue = false;
        for (let i = 0; i < showGroup.length; i++) {
            if (showGroup[i] === "股票名称") {
                isShowStockName = true;
                continue;
            }
            if (showGroup[i] === "所属行业") {
                isShowIndustry = true;
                continue;
            }
            if (showGroup[i] === "时间") {
                isShowTime = true;
                continue;
            }
            if (showGroup[i] === "行业均值") {
                isShowIndustryMeanValue = true;
                continue;
            }
            if (showGroup[i] === "行业排名") {
                isShowIndustryRank = true;
                continue;
            }
        }

        console.log("财务数据是入参：" + JSON.stringify(queryParams));


        let info = await financialThemDwService.getFinancialData(queryParams);
        console.log("财务数据是出参：" + info);

        info = JSON.parse(info);
        if (comUtil.isEmptyObj(info) || (info.message && info.message.code == -1) || comUtil.isEmptyObj(info.data)) {
            return {
                code: -1,
                message: "暂无数据"
            }
        }

        let template = "robotFinanceIndex";
        let params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }


        var date = "--"
        if (info && info.data && info.data.length > 0) {
            let infoData = info.data;
            var tableList = [];

            for (let i = 0; i < infoData.length; i++) {
                let item = infoData[i];
                var tableItem = {};
                var tableHead = [];
                var tableRow = [];
                if (isShowStockName) {
                    tableItem.leftTitle = item.secName;
                }
                if (isShowTime) {
                    tableItem.rightTitle = item.endDate;
                }
                if (item.endDate) {
                    var endDate = item.endDate;
                    date = endDate && endDate.length > 7 ? endDate.substring(0, 4) + '-' + endDate.substring(4, 6) + '-' + endDate.substring(6, 8) : '--';
                }


                if (isShowIndustry) {
                    tableItem.leftTitle += "(所属行业：" + item.induName + ")";
                }
                tableHead.push(item.queryIndicatorName);
                let queryConvertUnit = item.queryConvertUnit;
                let queryIndicatorUnit = item.queryIndicatorUnit;
                let queryIndicatorValue = item.queryIndicatorValue;
                if (queryIndicatorValue) {
                    if (queryConvertUnit) {
                        queryIndicatorValue = commonUtil.formatNumber(queryIndicatorValue, 2, false)
                    } else if (queryIndicatorUnit === "%") {
                        queryIndicatorValue = queryIndicatorValue ? queryIndicatorValue.toFixed(2) : '--';
                    }
                    tableRow.push(queryIndicatorValue + queryIndicatorUnit);
                } else {
                    tableRow.push("--");
                }
                if (isShowIndustryRank) {
                    tableHead.push("行业排名");
                    var induRank = item.induRank ? item.induRank : '--';
                    var induSecNum = item.induSecNum ? item.induSecNum : '--';
                    tableRow.push(induRank + '/' + induSecNum);
                }
                if (isShowIndustryMeanValue) {
                    tableHead.push("行业均值");
                    let avgConvertUnit = item.avgConvertUnit;
                    let avgIndicatorUnit = item.avgIndicatorUnit;
                    let induAverageValue = item.induAverage;
                    if (induAverageValue) {
                        if (avgConvertUnit) {
                            induAverageValue = commonUtil.formatNumber(induAverageValue, 2, false)
                        } else if (avgIndicatorUnit === "%") {
                            induAverageValue = induAverageValue ? induAverageValue.toFixed(2) : '--';
                        }
                        tableRow.push(induAverageValue + avgIndicatorUnit);
                    } else {
                        tableRow.push("--");
                    }
                }
                tableItem.list = [];
                tableItem.list.push(tableHead);
                tableItem.list.push(tableRow);
                tableList.push(tableItem);
            }
        } else {
            if (data.hasOwnProperty('setIndexData')) {
                let showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    info = "";
                }
            }
        }


        let result = {
            code: 0,
            message: "success",
            info: tableList,
            date: date,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    /**
     * 小e分析，数据是
     * @param data
     * @returns {Promise<void>}
     */
    async robotAnalysisHandlerDataIs(data) {
        //请求参数
        var queryParams = {
            entities: [],
            indicators: [],
            indexSort: "11",
            startAt: "",
            endAt: ""
        };
        //数据分类：11，30，9，23
        if (data.entitisVal && data.entitisVal.spriteType) {
            queryParams.indexSort = data.entitisVal.spriteType;
        }
        //设置实体
        switch (queryParams.indexSort) {
            case 11: //股票:secKey
                //选择了实体
                if (data.selectedEntities && data.selectedEntities.length > 0) {
                    for (var i = 0; i < data.selectedEntities.length; i++) {
                        queryParams.entities.push(data.selectedEntities[i].secKey);
                    }
                } else { //没有选择实体
                    if (commonUtil.stringIsNotEmpty(data.secKeys)) { //有动参，设置为动参
                        var secKeys = data.secKeys;
                        queryParams.entities = secKeys.split(',');
                    } else { //没有选择实体，且没有动参，设置默认股票：中国联通
                        queryParams.entities.push("1010000035");
                    }
                }
                //选择了指标
                if (data.selectedFinancialIndex && data.selectedFinancialIndex.length > 0) {
                    for (var i = 0; i < data.selectedFinancialIndex.length; i++) {
                        queryParams.indicators.push(data.selectedFinancialIndex[i].name);
                    }
                } else { //没有设置指标，看是否有动参
                    if (commonUtil.stringIsNotEmpty(data.stockBaseInfo)) { //有动参，设置为动参
                        var stockBaseInfo = data.stockBaseInfo;
                        queryParams.indicators = stockBaseInfo.split(',');
                    } else if (commonUtil.stringIsNotEmpty(data.baseQuota)) { //基础报价
                        var baseQuota = data.baseQuota;
                        queryParams.indicators = baseQuota.split(',');
                    } else {
                        queryParams.indicators.push("流通股本");
                    }
                }
                break;
            case 30: //行业，默认银行，申万行业编码
                break;
            case 9: //公司和机构:orgKey
                //选择了实体
                if (data.selectedEntities && data.selectedEntities.length > 0) {
                    for (var i = 0; i < data.selectedEntities.length; i++) {
                        queryParams.entities.push(data.selectedEntities[i].orgKey);
                    }
                } else { //没有选择实体
                    if (commonUtil.stringIsNotEmpty(data.orgKeys)) { //有动参，设置为动参
                        var orgKeys = data.orgKeys;
                        queryParams.entities = orgKeys.split(',');
                    } else { //没有选择实体，且没有动参，设置默认公司和机构：中国联通
                        queryParams.entities.push("10000023");
                    }
                }
                //选择了指标
                if (data.selectedFinancialIndex && data.selectedFinancialIndex.length > 0) {
                    for (var i = 0; i < data.selectedFinancialIndex.length; i++) {
                        queryParams.indicators.push(data.selectedFinancialIndex[i].name);
                    }
                } else { //没有设置指标，看是否有动参
                    if (commonUtil.stringIsNotEmpty(data.financialEntity)) { //有动参，设置为动参
                        var financialEntity = data.financialEntity;
                        queryParams.indicators = financialEntity.split(',');
                    } else {
                        queryParams.indicators.push("营业收入");
                    }
                }
                break;
            case 23: //地域:dictId
                //选择了实体
                if (data.selectedEntities && data.selectedEntities.length > 0) {
                    for (var i = 0; i < data.selectedEntities.length; i++) {
                        queryParams.entities.push(data.selectedEntities[i].dictId);
                    }
                } else { //没有选择实体
                    if (commonUtil.stringIsNotEmpty(data.areaKeys)) { //有动参，设置为动参
                        var areaKeys = data.areaKeys;
                        queryParams.entities = areaKeys.split(',');
                    } else { //没有选择实体，且没有动参，设置默认地域：北京市
                        queryParams.entities.push("R0303010100");
                    }
                }
                //选择了指标
                if (data.selectedFinancialIndex && data.selectedFinancialIndex.length > 0) {
                    for (var i = 0; i < data.selectedFinancialIndex.length; i++) {
                        queryParams.indicators.push(data.selectedFinancialIndex[i].name);
                    }
                } else { //没有设置指标，看是否有动参
                    if (commonUtil.stringIsNotEmpty(data.macroEntity)) { //有动参，设置为动参
                        var macroEntity = data.macroEntity;
                        queryParams.indicators = macroEntity.split(',');
                    } else {
                        queryParams.indicators.push("GDP");
                    }
                }
                break;
        }

        //指定时间
        if (data.timeRangeType == 3 && data.timeSeries && data.timeSeries.length > 0) {
            queryParams.startAt = data.timeSeries[0];
            queryParams.endAt = data.timeSeries[0];
        } else { //任意时间
            if (commonUtil.stringIsNotEmpty(data.endAt)) { //有动参，设置为动参
                queryParams.startAt = data.endAt;
                queryParams.endAt = data.endAt; //时间点，非时间段，所以起止时间是一样的，取endAt
            } else { //无动参，设置为当前时间
                queryParams.startAt = format.formatTime(Date.now(), "yyyyMMdd");
                queryParams.endAt = format.formatTime(Date.now(), "yyyyMMdd");
            }
        }

        var info = await reportCompositeService.getAnalysisDataIs(queryParams);

        if (queryParams.indexSort == 23) {
            info.timeUnit = "year";
        }
        var template = "robotAnalysisDataIs";
        var params = handlerUtil.getTemplateConfig(template);
        if (params.code === -1) {
            return params;
        }

        if (info && info.data && info.data.length > 0) {
            info.displayMode = data.displayMode; //显示话术还是值
        } else {
            if (data.hasOwnProperty('setIndexData')) {
                var showData = data.setIndexData;
                if (showData && showData.setIndexShowType == 1 && showData.setIndexShowFlag == 1 && commonUtil.stringIsNotEmpty(showData.replateContent)) {
                    info = showData.replateContent;
                    template = 'text';
                    params = handlerUtil.getTemplateConfig(template);
                } else {
                    info = "";
                }
            }
        }
        var result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        return result;
    },

    /**
     * 小e技术分析
     * @param data
     * @returns {Promise<*>}
     */
    async robotChartHandler(data) {
        let symbol;
        let code;
        let marketType;
        if (data.code) {
            symbol = data.val + data.code;
            code = data.code;
            marketType = data.val;
        } else {
            symbol = "sz000001";
            code = "000001";
            marketType = "sz";
        }

        if (data.symbol) {
            symbol = data.symbol;
            code = symbol.slice(2, 8);
            marketType = symbol.slice(0, 2);
        }
        let price = await quotaService.getSymbolPrice({symbol: symbol});
        let typeD;
        let typeM;

        let template;
        if (data.dataTypes == "STOCK_MACD") {
            template = "robotChartIndex";
            typeD = 'EMACD';
            typeM = 'TXTMACD';
        } else if (data.dataTypes == "STOCK_KDJ") {
            template = "robotChartIndex";
            typeD = 'EKD';
            typeM = 'TXTKD';
        } else if (data.dataTypes == "STOCK_RSI") {
            template = "robotChartIndex";
            typeD = 'ERSI';
            typeM = 'TXTRSI';
        } else {
            template = "robotChartKLine";
            typeD = 'EQUSHI';
            typeM = 'TXTQUSHI';
        }

        let kline = await stockAnalysisService.getKLineData({cycle: 'DAY', type: typeD, val: marketType, symbol: code});
        let memo = await stockAnalysisService.getKLineData({cycle: 'DAY', type: typeM, val: marketType, symbol: code});

        let params = handlerUtil.getTemplateConfig(template);


        if (kline.isError || memo.isError) {
            return {
                code: -1,
                message: "",
                templateType: params.templateType,
            }
        }
        if (params.code === -1) {
            return params;
        }

        let info = {};
        info.kline = kline;
        info.price = price;
        if (memo.message.code == 0 && memo.data) {
            for (let i in memo.data.detail) {
                info.memo = memo.data.detail[i].memo;
            }
        } else {
            info.momo = "";
        }
        let result = {
            code: 0,
            message: "success",
            info: info,
            dataType: data.dataTypes,
            params: params,
            commonUtil: commonUtil
        };
        // console.log(JSON.stringify(result));
        return result;
    },

    transferInfoParams: function (params, info) {
        if (!info.hasOwnProperty('data')) {
            return info;
        }
        let list = info.data;
        if (list.length == 0) {
            return info;
        }
        if (params.length == 0) {
            return info;
        }
        // params内结构['newP,oldP','newP,oldP'...]
        for (let i = 0; i < params.length; i++) {
            let param = params[i];
            let arr = param.split(',');
            let newP = arr[0];
            let oldP = arr[1];
            for (let j = 0; j < list.length; j++) {
                info.data[j][newP] = info.data[j][oldP];
            }
        }
        return info;
    }

};

export default robotHandler;
