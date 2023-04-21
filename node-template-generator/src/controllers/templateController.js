// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import {
    reportCompositeService,
    searchTemplateService,
    semanticApiService,
    semanticDatacenterServic,
    semanticCompositeService,
    stockAnalysisService,
    quotaService,
    autoReportIndustryService
} from '../service';
import commonUtil from '../utils/commonUtil';
import config from '../config';
import interfaceConfig from '../libs/interfaceConfig'
import middleGroundConfig from "../libs/middleGroundConfig";
import reportHandler from '../controllers/intelligentReportHandler';
import templateToText from '../controllers/templateToText';
import templateToAudio from '../controllers/templateToAudio';
import chartDataForView from '../controllers/chartDataForView';
import _ from 'underscore'

let logger = require('../utils/logger');
let ejs = require("ejs");

function getRisk(info, type) {
    let returnRes = {};
    returnRes.risk = "";
    returnRes.nodata = false;
    if (info == undefined || info.data == undefined) {
        returnRes.nodata = true;
        return returnRes;
    }
    switch (type) {
        case "stockHolder":
            let shareholderAmountList = info.data.shareholderAmountList;
            let lastItem = shareholderAmountList[0];
            if (lastItem.chanOfLast == undefined) {
                returnRes.risk = "mid"
            } else {
                if (lastItem.chanOfLast < 0) {
                    returnRes.risk = "add"
                } else if (lastItem.chanOfLast > 0) {
                    returnRes.risk = "reduce"
                } else {
                    returnRes.risk = "mid"
                }
            }
            break;
        case "financing":
            let tMarMargintradeInfo = info.data.tMarMargintradeInfo;
            let seclendingRank = tMarMargintradeInfo.seclendingRank;
            if (seclendingRank > 500) {
                returnRes.risk = "reduce"
            } else {
                returnRes.risk = "add"
            }
            break;
        case "northboundFunds":
            if (info.data == undefined) {
                returnRes.nodata = true;
            } else {
                let stockInfo = info.data.tMarHkshscTop10Stocks
                let buy = stockInfo.buyValue;
                let sell = stockInfo.sellValue;
                if (buy - sell > 0) {
                    returnRes.risk = "add";
                } else if (buy - sell < 0) {
                    returnRes.risk = "reduce";
                } else {
                    returnRes.risk = "mid";
                }
            }
            break;
        case "cashFlow":
            let temp = info.data.tMarStkLiquidInfo;
            let allTot = temp.totSecNum;
            let allRank = temp.m1TotRank;
            if (allRank > allTot / 2) {
                returnRes.risk = "reduce"
            } else if (allRank < allTot / 2) {
                returnRes.risk = "add"
            } else {
                returnRes.risk = "mid";
            }
            break;
        case "stockTech":
            if (info.kline.data == undefined) {
                returnRes.risk = "mid";
            } else if (info.kline.data.signalType == "down") {
                returnRes.risk = "reduce"
            } else if (info.kline.data.signalType == "up") {
                returnRes.risk = "add"
            } else {
                returnRes.risk = "mid";
            }
            break;
        case "executive":
            let list = info.data || [];
            if (list.length == 0) {
                returnRes.nodata = true;
            } else {
                let change = list[0].changeType;
                if (change == "离职") {
                    returnRes.risk = "reduce";
                } else if (change == "上任") {
                    returnRes.risk = "add";
                } else {
                    returnRes.risk = "mid";
                }
            }

            break;

        case "financialAnalysis":
            if (info.indexData === undefined || info.indexData.length === 0) {
                returnRes.nodata = true;
            } else {
                if (info.netProfitYoy > 0) {
                    returnRes.risk = 'add';
                } else if (info.netProfitYoy < 0) {
                    returnRes.risk = 'reduce';
                } else {
                    returnRes.risk = "mid";
                }
            }
            break;

        case "scarcity":
            if (commonUtil.stringIsEmpty(info.data)) {
                returnRes.nodata = true;
            } else {
                let level = info.data.level;

                if (level == '较少') {
                    returnRes.risk = "add";
                } else if (level == '较多') {
                    returnRes.risk = "reduce";
                } else {
                    returnRes.risk = "mid";
                }
            }
            break;
        case "industryProsperity":
            if (commonUtil.stringIsEmpty(info.data)) {
                returnRes.nodata = true;
            } else {
                let raise = info.data.raise;

                if (raise > 0) {
                    returnRes.risk = "add";
                } else if (raise < 0) {
                    returnRes.risk = "reduce";
                } else {
                    returnRes.risk = "mid";
                }
            }
            break;
        case "financialIndex":
            if (commonUtil.stringIsEmpty(info.data)) {
                returnRes.nodata = true;
            } else {
                let datas = info.data;
                if (datas[0] == undefined) {
                    returnRes.nodata = true;
                } else {
                    let netProfitYoy = datas[0].netProfitYoy;
                    if (netProfitYoy > 0) {
                        returnRes.risk = "add";
                    } else if (netProfitYoy < 0) {
                        returnRes.risk = "reduce";
                    } else {
                        returnRes.risk = "mid";
                    }
                }
            }
            break;
        case "focusSignal":
            if (commonUtil.stringIsEmpty(info.data) || commonUtil.stringIsEmpty(info.data.infos)) {
                returnRes.nodata = true;
            } else {
                let recentData = info.data.infos;
                let positiveCount = 0;
                let negativeCount = 0;
                let neutralCount = 0;
                recentData.forEach(function (item, index) {
                    if (item.attitude == "利好") {
                        positiveCount++;
                    } else if (item.attitude == "利空") {
                        negativeCount++;
                    } else {
                        neutralCount++;
                    }
                });
                if (neutralCount >= 2) {
                    returnRes.nodata = true;
                    // returnRes.risk = "reduce";
                } else if (negativeCount >= 2) {
                    returnRes.risk = "reduce";
                } else {
                    returnRes.risk = "add";
                }
            }
            break;
        case "informationEvent":
            if (info.data || info.data.list.length !== 0) {
                returnRes.nodata = false;
            } else {
                returnRes.nodata = true;
            }
            return returnRes;
            break;
        case "ZXCXHeaderScreen":
            returnRes.nodata = false;
            return returnRes;
            break;
        case "infomationMes":
        case "riskNotice":
            if (info.data || info.data.list.length !== 0) {
                returnRes.nodata = false;
            } else {
                returnRes.nodata = true;
            }
            break;
        case "ZXCXHeaderScreenList":
            returnRes.nodata = false;
            return returnRes;
            break;
        case "eventEvolve":
            returnRes.nodata = false;
            break;
        case "stockOwnershipIncentive":
            if (info.data && info.data.length > 0) {
                returnRes.nodata = false;
                let netProfitYoy = info.data[0].progress;
                if (netProfitYoy == '实施') {
                    returnRes.risk = "add";
                } else if (netProfitYoy == '停止实施' || netProfitYoy == '延期实施') {
                    returnRes.risk = "reduce";
                } else {
                    returnRes.risk = "mid";
                }
            } else {
                returnRes.nodata = true;
            }
            break;
        case "knowMap":
            if (info.data.knowledgeRelationList.length != 0) {
                returnRes.nodata = false;
            } else {
                returnRes.nodata = true;
            }
            break;
        case "exchangeLetter":
            if (commonUtil.stringIsEmpty(info.data.list)) {
                returnRes.nodata = true;
            } else {
                returnRes.risk = "reduce";
            }
            break;
        case "holdPositionPlan":
            if (commonUtil.stringIsEmpty(info.data.list)) {
                returnRes.nodata = true;
            } else {
                let positiveCount = 0;
                let negativeCount = 0;

                let list = info.data.list;
                for (let i = 0; i < list.length; i++) {
                    let item = list[i];
                    if (item.signalType == "积极信号") {
                        positiveCount++;
                    } else if (item.signalType == "风险信号") {
                        negativeCount++;
                    }
                }

                if (negativeCount >= 2) {
                    returnRes.risk = "reduce";
                } else {
                    returnRes.risk = "add";
                }
            }
            break;
        case "industrySignal":
            if (commonUtil.stringIsEmpty(info.data.list)) {
                returnRes.nodata = true;
            } else {
                returnRes.risk = "";
            }
            break;
        case "autoReportDetail"://行业简介
            if (info.data.intro !== 0) {
                returnRes.nodata = false;
            } else {
                returnRes.nodata = true;
            }
            break;
        case "autoReportDetailUpStream":
            if (info.data.upStream !== 0) {
                returnRes.nodata = false;
            } else {
                returnRes.nodata = true;
            }
            break;
        case "autoReportDetailDownStream":
            if (info.data.downStream !== 0) {
                returnRes.nodata = false;
            } else {
                returnRes.nodata = true;
            }
            break;
        case "autoReportCompanyList":
            if (info.data.companyInfoList !== 0) {
                returnRes.nodata = false;
            } else {
                returnRes.nodata = true;
            }
            break;
        case "autoReportIndustryTrend"://行业发展趋势
        case "autoReportIndustryMarketSize":
        case "autoReportIndustryProfitabilityAnalysis":
        case "autoReportIndustryProductPrice":
        case "autoReportIndustryFocus":
        case "autoReportIndustryInvestmentAdvice":
        case "autoReportIndustryRecommendStock":
        case "autoReportIndustryExternalEnvironment":
        case "autoReportIndustryLeadingAnalysis":
        case "autoReportIndustryCapacity":
            if (info.data !== 0) {
                returnRes.nodata = false;
            } else {
                returnRes.nodata = true;
            }
            break;
    }
    return returnRes;
};

async function apiGet(params, type, quota, queryParams) {
    let info = {};


    switch (type) {
        case "stockTech":
            let stock = {};
            stock.subjectMarket = params.subjectMarket;
            stock.subjectCode = params.subjectCode;
            let stockType = await semanticCompositeService.getStockType(stock);
            if (stockType.data.status == 1) {
                let kline = await stockAnalysisService.getKLineData({
                    cycle: 'DAY',
                    type: 'EQUSHI',
                    val: params.subjectMarket,
                    symbol: params.subjectCode
                });
                let memo = await stockAnalysisService.getKLineData({
                    cycle: 'DAY',
                    type: 'TXTQUSHI',
                    val: params.subjectMarket,
                    symbol: params.subjectCode
                });
                if (memo.message.code == 0 && memo.data) {
                    for (let i in memo.data.detail) {
                        info.memo = memo.data.detail[i].memo;
                    }

                } else {
                    info.momo = "";
                }
                info.data = {};
                info.kline = kline;
                info.price = quota;
                info.inNoData = commonUtil.isNoData(kline);
                return info;
            } else {
                info.inNoData = true;
                return info;
            }

        // 财务全景
        case 'financialAnalysis':
            // 蜘蛛图用的字段名称
            let fieldCategories = ['profitScore', 'growupScore', 'operationScore', 'debtScore', 'cashScore'];
            // 蜘蛛图展示名称
            let xCategories = ['盈利', '成长', '运营', '偿债', '现金流'];

            // 指标，维度
            let indexes = [
                {
                    type: 'profit',
                    name: '盈利能力',
                    timeType: 'quarter',
                    index: [['sFaGrossprofitmargin', 'sFaNetprofitmargin'], ['roe']]
                },
                {
                    type: 'growup',
                    name: '成长能力',
                    timeType: 'quarter',
                    index: [['sFaYoynetprofit', 'sFaYoyTr', 'sgr']]
                },
                {
                    type: 'operation',
                    name: '运营能力',
                    timeType: 'quarter',
                    index: [['sFaTurndays', 'sFaInvturndays'], ['sFaAssetsturn', 'sFaCaturn', 'sFaFaturn'], ['sFaArturn']]
                },
                {
                    type: 'debt',
                    name: '偿债能力',
                    timeType: 'quarter',
                    index: [['sFaCurrent', 'sFaQuick'], ['sFaDebttoassets']]
                },
                {type: 'cash', name: '现金流', timeType: 'quarter', index: [['netCashFlowsOperAct']]},
                {type: 'cash', name: '现金流', timeType: 'year', index: [['cashReRatio'], ['cashAdequacyRatio']]},
            ];

            // for signal
            let tempParams = JSON.parse(JSON.stringify(params));
            tempParams.predicateType = '财务指标-一键研报';
            tempParams.sourceFrom = '报告平台-财务指标-一键研报';
            let signalResult = await semanticApiService.apiQaQuestion(tempParams);
            info.inNoData = commonUtil.isNoData(signalResult);

            // 财务分析数据，包含雷达图
            params.sourceFrom = '报告平台-财务指标-一键研报';
            let result = info = await semanticApiService.apiQaQuestion(params);

            if (!result.data) {
                info.inNoData = true;
                return info;
            }

            if (!info.inNoData) {
                info.inNoData = commonUtil.isNoData(result);
            }

            // 取顶部两列指标
            let scores = result.data.scores || []
            // 取最近一的报告期
            let endDate
            if (scores.length > 0) {
                endDate = scores[0].endDate
            }
            // 报告期数据
            let financeReportResult
            // 从月份推导报告周期
            if (endDate) {
                let month = endDate.toString().substr(4, 2)
                let quarter = ''
                switch (month) {
                    case '03':
                        quarter = 'oneQuarter'
                        break;
                    case '06':
                        quarter = 'twoQuarter'
                        break;
                    case '09':
                        quarter = 'threeQuarter'
                        break;
                    case '12':
                        quarter = 'year'
                        break;
                }
                // 转换参数
                let reportParams = {
                    marketType: params.subjectMarket,
                    stockCode: params.subjectCode,
                    financeQuarter: quarter,
                    cache: true
                }
                financeReportResult = await semanticApiService.getFinanceReport(reportParams)
            }

            // 所属行业
            let industry = result.data.induSortName || '';
            let industryCode = result.data.induSortCode || '';

            // 三大行业银行，证券，保险独立指标
            if (['S4801', 'S4901', 'S4902'].indexOf(industryCode) !== -1) {
                // 替换为专项指标用的字段，及中文名称
                fieldCategories.splice(2, 1, 'specialScore');
                xCategories.splice(2, 1, '专项指标<br/>（' + industry + '）');
                if (industryCode === 'S4801') {
                    indexes.splice(2, 1, {
                        type: 'yinhangSpec',
                        name: '银行专项指标',
                        timeType: 'quarter',
                        index: [['capiAdeRatio'], ['nplRatio'], ['netCapital']]
                    });
                } else if (industryCode === 'S4901') {
                    indexes.splice(2, 1, {
                        type: 'zhengquanSpec',
                        name: '证券专项指标',
                        timeType: 'quarter',
                        index: [['netCapitalVal']]
                    });
                } else if (industryCode === 'S4902') {
                    indexes.splice(2, 1, {
                        type: 'baoxianSpec',
                        name: '保险专项指标',
                        timeType: 'quarter',
                        index: [['lossRatioProperty'], ['intrinsicValueLife']]
                    });
                }
            }

            let param = {
                marType: params.subjectMarket,
                secCode: params.subjectCode,
            };
            let arrReqs = [];
            // 循环拼所有指标请求接口
            for (let i = 0; i < indexes.length; i++) {
                param.statType = indexes[i].type;
                param.type = indexes[i].timeType;
                // let service = await semanticApiService.getPartInfos(param).catch(function () {});
                // arrReqs.push(service);
                arrReqs.push(semanticApiService.getPartInfos(param));
            }

            info.indexes = indexes;
            info.fieldCategories = fieldCategories;
            info.xCategories = xCategories;
            info.financeReportData = financeReportResult ? financeReportResult.data : []
            if (signalResult.data && signalResult.data.length > 0)
                info.netProfitYoy = signalResult.data[0].netProfitYoy;

            // 合并请求多个接口
            return Promise.all(arrReqs).then(result => {
                info.indexData = result;
                if (!info.inNoData) {
                    for (let i = 0; i < result.length; i++) {
                        info.inNoData = commonUtil.isNoData(result[i]);
                        if (info.inNoData) {
                            return info;
                        }
                    }
                }
                return info;
            }).catch(function (err) {
                return info
            });

        case "industryConcept":
            info.data = {};
            return info;
        case "informationEvent":
            info = await semanticApiService.getinforamtionEvent(params.reqParams);
            info.inNoData = commonUtil.isNoData(info);

            if (!info.inNoData) {
                var idsList = [];
                for (let i = 0; i < info.data.list.length; i++) {
                    var item = info.data.list[i];
                    var infoIds = item.infoIds;
                    var temp = [];
                    if (infoIds.length > 2) {
                        info.data.list[i].showMore = true;
                        temp = infoIds.slice(0, 2);
                    } else {
                        info.data.list[i].showMore = false;
                        temp = infoIds;
                    }
                    idsList = idsList.concat(temp)

                    // info.data.list[i].infos = infoIds;
                }
                idsList = idsList.join(",");
                var data = {
                    ids: idsList,
                    ps: 20
                }
                let infoRes = await semanticApiService.getinforamtionEventRelated(data);
                for (let i = 0; i < info.data.list.length; i++) {
                    var item = info.data.list[i];
                    item.infos = [];
                    for (let j = 0; j < infoRes.data.length; j++) {
                        for (let z = 0; z < item.infoIds.length; z++) {
                            if (item.infoIds[z] == infoRes.data[j].id) {
                                item.infos.push(infoRes.data[j]);
                            }
                        }
                    }
                }
                // info.data.list[i].infos = infoRes.data;
            }
            return info;
        case "ZXCXHeaderScreenList":
            info.data = {};
            return info;
        case "ZXCXHeaderScreen":
            info.data = {};
            return info;
        case "eventEvolve":
            info.data = {};
            return info;
        case "knowAtlas":
            info.data = {};
            return info;
        case "infomationMes":
            info = await semanticApiService.getInfomationMes(params.reqParams);
            info.inNoData = commonUtil.isNoData(info);
            return info;
        case "riskNotice": //研报搜索组件、风险提示
            info = await semanticApiService.getRiskNotice(params.reqParams);
            info.inNoData = commonUtil.isNoData(info);
            return info;
        case "northboundFunds":
            let tempStock = {
                marType: params.subjectMarket,
                secCode: params.subjectCode
            }
            let stockMoney = await semanticDatacenterServic.getStockNorthMoney(tempStock);
            if (stockMoney.data) {
                let temp = {
                    capitalFlowType: params.predicateType
                }
                let money = await semanticDatacenterServic.getNorthMoney(temp);
                info.data = {};
                info.data.inStocks = money.data;
                info.data.tMarHkshscTop10Stocks = stockMoney.data;
                info.inNoData = commonUtil.isNoData(info);
                return info;
            } else {
                info.inNoData = true;
                return info;
            }
            break;
        case "knowMap":
            let obj = {};
            obj.q = params.reqParams.q;
            info = await semanticApiService.apiKnowMap(obj);
            return info;
        case "exchangeLetter":
        case "industrySignal":
        case "holdPositionPlan":
            // 获取当前时间
            let curDate = (new Date()).getTime();
            // 将一个月的时间单位换算成毫秒
            let halfYear = 30 * 24 * 3600 * 1000;
            // 一个月前的时间
            let pastResult = curDate - halfYear;

            let queryParams = {
                'cp': "1",
                'timeField': "publishAt",
                'startAt': pastResult,
                'endAt': curDate,
                'entities': params.subjectMarket + params.subjectCode,
                'entityTypes': '股票'
            };

            if (type == 'exchangeLetter') {
                queryParams.labels = '基本面';
                queryParams.ps = "10";
                queryParams.category = "交易所问询函、关注函、意见函";
                // queryParams.category = "业绩变化";
            } else if (type == 'holdPositionPlan') {
                queryParams.labels = '基本面';
                queryParams.ps = "10";
                queryParams.category = "员工持股";
                // queryParams.category = "业绩变化";
            } else if (type == 'industrySignal') {
                queryParams.labels = '产业';
                queryParams.ps = "3";
            }

            info = await semanticApiService.apiSignalSearch(queryParams);
            return info;


        default:
            params.sourceFrom = '报告平台-固定问答-'+params.predicateType;
            info = await semanticApiService.apiQaQuestion(params);
            info.inNoData = commonUtil.isNoData(info);
            return info;
    }
}


module.exports = {
    //
    async search(req, res, next) {
        let type = req.query.type;
        let code = req.query.code ? req.query.code : "000001";
        let needJson = req.query.d === "j";
        let titleSize = req.query.t ? req.query.t : 2;
        let queryParams = req.query;

        let market = stockCodeFixed(code);
        // 取行情数据
        let quota = await quotaService.getSymbolPrice({symbol: market + code});
        if (quota.error === "not found.") {
            res.send({
                code: -1,
                message: "股票不合法",
                type: type,
                stockCode: code
            });
            return;
        }

        // 取模块配置参数
        let templateConfig = interfaceConfig["interfaceConfig"];
        let params = _.clone(templateConfig[type]);
        if (params) {
            params.subjectName = quota.stkName;
            params.subjectCode = code;
            params.subjectMarket = market;
            params.type = type;
            params.noSource = needJson;
            params.titleSize = titleSize;
            params.reqParams = queryParams;
        } else {
            res.send({
                code: -1,
                message: "暂不支持该指标",
                type: type,
                stockCode: code
            });
            return;
        }

        //请求接口返回数据
        let info = await apiGet(params, type, quota, queryParams);

        //判断风险类型和是否有展示数据
        let risk = getRisk(info, type);

        if (risk.nodata || info.inNoData) {
            res.send({
                nodata: true,
                code: -1,
                message: "无数据",
                type: type,
                stockCode: code
            });
            return;
        }
        if (type === 'stockOwnershipIncentive') {
            params.name = params.name + '（' + info.data[0].progress + '）';
        }
        if (type === 'knowAtlas') {
            params.showtext = req.query.showtext || false;
            params.showtitle = req.query.showtitle || false;
            params.color = req.query.color || false;
            params.input = req.query.input || '锂电池';
            params.disName = req.query.disName || params.input;
            params.admin = req.query.admin || 'rxhui';
            params.entityType = req.query.entityType || '';
        }

        let sn = new Date().getTime();

        let runtimeParams = {
            subjectName: params.subjectName,
            subjectMarket: params.subjectMarket,
            subjectCode: params.subjectCode,
            subjectType: params.subjectType,
            predicateType: params.predicateType,
            organization: params.organization,
            recordLog: false
        };

        let renderData = {
            sn: sn,
            info: info,
            risk: risk,
            commonUtil: commonUtil,
            params: params,
            code: params.subjectCode,
            name: params.subjectName,
            symbol: params.subjectMarket + params.subjectCode,
            preAnswer: info.preAnswerContent,
            host: config[process.env.NODE_ENV].host,
            config: config[process.env.NODE_ENV].resource,
            robotApiUrl: config[process.env.NODE_ENV].robotApiUrl,
            h5ApiUrl: config[process.env.NODE_ENV].h5ApiUrl,
            bigSearchUrl:config[process.env.NODE_ENV].bigSearchUrl,
            runtimeParams: runtimeParams
        };

        ejs.renderFile("./src/questionView/template/" + params.templateName + ".ejs", renderData, function (err, str) {
            console.log(err)
            if (needJson) {
                res.send({
                    risk: renderData.risk.risk,
                    name: renderData.params.name,
                    info: info,
                    stockName: renderData.name,
                    type: renderData.params.type,
                    sn: sn,
                    templateObject: renderData.params.templateName,
                    jsArray: renderData.params.jsArray,
                    content: str,
                    h5ApiUrl: config[process.env.NODE_ENV].h5ApiUrl,
                    bigSearchUrl:config[process.env.NODE_ENV].bigSearchUrl,
                    srcHost: config[process.env.NODE_ENV].resource
                })
            } else {
                res.set('Content-Type', 'text/html');
                res.send(str);
            }
        });

        // let semanticapiTime = new Date().getTime() - sn;
        // let totalTime = new Date().getTime() - sn;
        // logger.info("用时", {
        //   semanticApi: semanticapiTime,
        //   totalTime: totalTime,
        // });
    },

    async station(req, res) {
        let needJson = '';//是否返回json
        let symbol = '';//个股股票
        let index = '';//指数股票
        let industry = '';//行业
        let industryName = '';//行业
        let startAt = '';//开始时间
        let endAt = '';//结束时间
        let relevantPeople = '';//相关人物
        let queryParams = '';//预览参数
        let objectName = '';//对话机器人平台动态实体
        let financialEntity = '';//对话机器人平台财务实体
        let knowledgeTypes = '';//知识库知识类型
        let entityLeftIds = '';//知识库实体类型
        let entityLeftTypeId = '';//知识库实体类型
        let stockBaseInfo = '';//对话机器人平台股票指标
        let baseQuota = '';//股票基础报价指标
        let macroEntity = '';//对话机器人平台地域指标
        // let d = '';
        let templateType = "";//模版类型
        let orgKeys = "";//模版类型
        let areaKeys = "";//地域实体id
        let secKeys = "";//股票实体id，类似1010000937
        let needAudioText = "";

        //模版id
        let templateId = req.query.chartId ? req.query.chartId : -1;
        let templateTag = req.query.tag ? req.query.tag : "";
        let loadType = -1;
        let parentId = req.query.parentId ? req.query.parentId :templateId;

        if (templateId !== -1) {
            loadType = 0;
            needJson = req.query.d === "j";
            symbol = req.query.symbol;
            index = req.query.index;
            industry = req.query.industry;
            industryName = req.query.industryName;
            startAt = req.query.startAt;
            endAt = req.query.endAt;
            relevantPeople = req.query.relevantPeople;
            objectName = req.query.objectName;
            orgKeys = req.query.orgKeys;
            secKeys = req.query.secKeys;
            areaKeys = req.query.areaKeys;
            financialEntity = req.query.financialEntity;
            entityLeftIds = req.query.entityLeftIds;
            entityLeftTypeId = req.query.entityLeftTypeId;
            knowledgeTypes = req.query.knowledgeTypes;
            stockBaseInfo = req.query.stockBaseInfo;
            macroEntity = req.query.macroEntity;
            baseQuota = req.query.baseQuota;
            needAudioText = req.query.needAudioText;
        } else {
            loadType = 1;
            needJson = req.body.d === "j";
            queryParams = req.body.qp;
        }

        let data = {};
        let requestResult = {};

        switch (loadType) {
            case 0:
                requestResult = await reportCompositeService.getChartConfig({ids: [templateId]});

                if (commonUtil.stringIsEmpty(requestResult) || requestResult.data.length === 0) {
                    return res.send(
                      {
                        code: -1,
                        message: "未查找到该模版数据!",
                        chartId: templateId,
                        template: templateType,
                        tag: templateTag
                      });
                }
                data = (requestResult.data)[0].templateValue;

                templateType = (requestResult.data)[0].type;

                break;
            case 1:
                if (queryParams) {
                    data = JSON.parse(queryParams);
                    if (commonUtil.stringIsNotEmpty(data.type)) {
                        templateType = data.type;
                    } else {
                        templateType = 'chart';
                    }
                }
                break;
            case -1:
                return res.send({code: -1, message: "请输入模版Id或者预览参数", template: templateType});
        }

        //赋值动参
        //判断是不是需要转换为JsonObject
        if (!(typeof (data) == "object" && Object.prototype.toString.call(data).toLowerCase() == "[object object]" && !data.length)) {
            data = JSON.parse(data);
        }
        data.d = needJson;
        data.loadType = loadType;
        data.chartId = templateId;
        data.dateStyle  =  req.query.d;
        data.tag = templateTag;
        data.parentId = parentId;

        if (commonUtil.stringIsNotEmpty(symbol)) {
            data.symbol = symbol;
            if (commonUtil.stringIsNotEmpty(data.templateUrl)) {
                data.templateUrl += "&symbol=" + symbol;
            }
        }//动态个股
        if (commonUtil.stringIsNotEmpty(index)) {
            data.index = index;
            if (commonUtil.stringIsNotEmpty(data.templateUrl)) {
                data.templateUrl += "&index=" + index;
            }
        }//动态指数
        if (commonUtil.stringIsNotEmpty(industry)) {
            data.industry = industry;
            if (commonUtil.stringIsNotEmpty(data.templateUrl)) {
                data.templateUrl += "&industry=" + industry;
            }
        }//动态行业
        if (commonUtil.stringIsNotEmpty(industryName)) {
            data.industryName = industryName;
            if (commonUtil.stringIsNotEmpty(data.templateUrl)) {
                data.templateUrl += "&industryName=" + industryName;
            }
        }//动态行业
        if (commonUtil.stringIsNotEmpty(startAt)) {
            data.startAt = startAt;
            if (commonUtil.stringIsNotEmpty(data.templateUrl)) {
                data.templateUrl += "&startAt=" + startAt;
            }
        }//动态开始时间
        if (commonUtil.stringIsNotEmpty(endAt)) {
            data.endAt = endAt;
            if (commonUtil.stringIsNotEmpty(data.templateUrl)) {
                data.templateUrl += "&endAt=" + endAt;
            }
        }//动态结束时间
        if (commonUtil.stringIsNotEmpty(relevantPeople)) {
            data.relevantPeople = relevantPeople;
        }//动态结束时间
        if (commonUtil.stringIsNotEmpty(objectName)) {
            data.objectName = objectName;
        }//动态个股

        if (commonUtil.stringIsNotEmpty(orgKeys)) {
            data.orgKeys = orgKeys;
        }
        //地域实体
        if (commonUtil.stringIsNotEmpty(areaKeys)) {
            data.areaKeys = areaKeys;
        }
        //股票实体
        if (commonUtil.stringIsNotEmpty(secKeys)) {
            data.secKeys = secKeys;
        }
        //公司和机构指标，在这里取
        if (commonUtil.stringIsNotEmpty(financialEntity)) {
            data.financialEntity = financialEntity;
        }
        //股票指标，在这里
        if (commonUtil.stringIsNotEmpty(stockBaseInfo)) {
            data.stockBaseInfo = stockBaseInfo;
        }
        if (commonUtil.stringIsNotEmpty(baseQuota)) {
            data.baseQuota = baseQuota;
        }
        //地域指标，在这里取
        if (commonUtil.stringIsNotEmpty(macroEntity)) {
            data.macroEntity = macroEntity;
        }
        //知识库参数
        if (commonUtil.stringIsNotEmpty(entityLeftIds)) {
            data.entityLeftIds = entityLeftIds;
        }
        //知识库参数
        if (commonUtil.stringIsNotEmpty(entityLeftTypeId)) {
            data.entityLeftTypeId = entityLeftTypeId;
        }
        //知识库参数
        if (commonUtil.stringIsNotEmpty(knowledgeTypes)) {
            data.knowledgeTypes = knowledgeTypes;
        }


        requestResult = await reportHandler.getTemplateType(data, templateType,res);


        if(requestResult  == undefined){
            return;
        }
        if (requestResult.code === -1) {
            return res.send({
                code: -1,
                message: requestResult.message,
                template: templateType,
                chartId: templateId,
                tag: templateTag
            });
        }
        let sn = new Date().getTime();
        if (loadType === 0) {
            sn += parseInt(templateId);
        }
        let renderData = {
            sn: sn,
            params: {},
            commonUtil: commonUtil,
            queryParams: data,
            host: config[process.env.NODE_ENV].host,
            config: config[process.env.NODE_ENV].resource,
            robotApiUrl: config[process.env.NODE_ENV].robotApiUrl,
            bigSearchUrl:config[process.env.NODE_ENV].bigSearchUrl,
            h5ApiUrl: config[process.env.NODE_ENV].h5ApiUrl
        };
        for (let key in requestResult) {
            renderData[key] = requestResult[key];
        }
        renderData.params.noSource = needJson;
        var templateName = renderData.params.templateName;
        if (req.query.d === "d") {
            var onlyData;
            if (templateName == "speechTemplateView" || templateName == "paragraphView") {
                onlyData = templateToText.getTextByType(renderData, templateName);
            } else if (renderData.info.chartData) {
                onlyData = renderData.info.chartData
            } else if (renderData.info.data) {
                onlyData = {list: renderData.info.data, summary: renderData.info.summary}
            } else  if(renderData.info){
                onlyData = renderData.info
            }

            var dataList = {
                code: 0,
                message: "",
                templateName: templateName,
                data: onlyData,
                chartId: parentId,
            }
            return res.send(dataList);
        } else if (req.query.d === "text") { // 文本格式输出
            let templateTitle = {
                templateTitle: data.templateTitle,
                templateTitleLevel: data.templateTitleLeval,
                templateUrl: data.templateUrl,
            };
            let textResult = {
                chartId: parentId,
                name: renderData.params.name,
                sn: sn,
                templateName: templateName,
                tag: templateTag
            };

            if (!((templateType === "chart" && !data.conditionParams.useTitle) || commonUtil.stringIsEmpty(data.templateTitleLeval))) {
                textResult.templateTitleSettings = templateTitle;
            }
            textResult.textData = templateToText.getTextByType(renderData, templateName);
            textResult.chartData = chartDataForView.generateData(renderData, templateName);
            if (renderData.info && renderData.info.tableData) {
                textResult.tableData = renderData.info.tableData;
            }
            return res.send(textResult);
        } else { // html or json 输出
            ejs.renderFile("./src/questionView/template/intelligent/" + templateName + ".ejs", renderData, function
                (err, str) {
                if (err) {
                    console.log(err)
                }

                if (needJson) {
                  var outCome = {
                    chartId: parentId,
                    info: renderData.info,
                    name: renderData.params.name,
                    type: renderData.params.type,
                    sn: sn,
                    templateObject: renderData.params.templateName + sn,
                    jsArray: renderData.params.jsArray,
                    content: str,
                    srcHost: config[process.env.NODE_ENV].resource,
                    tag: templateTag
                  };
                  if(needAudioText == 'true'){
                    outCome.audioText = templateToAudio.getTextByType(renderData, templateName);
                  }
                  res.send(outCome)
                } else {
                    res.set('Content-Type', 'text/html');
                    res.send(str);
                }
            });
        }

    },

    async getDetail(req, res) {
        let caseNumber = req.query.caseNumber;
        let info = await semanticCompositeService.getStockDetail({
            caseNumber: caseNumber
        });
        var cookie =  req.cookies || {};
        var appKey = req.query.appKey || cookie.appKey;
        if( appKey instanceof Array  && appKey.length >0){
            appKey = appKey[0]
        }
        var showTitle = appKey != "appEzt";

        var str = '';
        if (info.message.code == 0) {

            str = commonUtil.stringIsNotEmpty(info.data.crTxt) ? info.data.crTxt : '暂无详情';
        }
        res.render('template/intelligent/CommonDetailView', {
            content: str,
            showTitle:showTitle
        })
    }

};

function stockCodeFixed(code) {
    let market;
    if (code.substr(0, 1) == "0" || code.substr(0, 1) == "3") {
        market = "sz";
    } else {
        market = "sh"
    }
    return market;
}
