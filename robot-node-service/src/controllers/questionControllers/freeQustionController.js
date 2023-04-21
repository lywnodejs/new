// controller 是直接处理请求的函数集合，函数格式为function(req, res)
import {semanticApiService} from '../../service/index';
import commonUtil from '../../questionView/utils/commonUtil';

import eventInfluenceController from './eventInfluenceController';
import companyExecutivesController from './companyExecutivesController';
import baseQuotaController from './baseQuotaController';
import themeController from './themeController';
import companyMainController from './companyMainController';
import companyIntroController from './companyIntroController';
import companyAddressController from './companyAddressController';
import stockTechAnalyseController from './stockTechAnalyseController';
import sh_klineController from './sh_klineController';
import stockRecommandController from './stockRecommandController';
import industryRecommandController from './industryRecommandController';
import stockRelatedReportsController from './stockRelatedReportsController';
import stockPankouController from './stockPankouController';
import stockProfitDataController from './stockProfitDataController';
import noAnswerController from './noAnswerController';
import sayHelloController from './sayHelloController';
import undevelopedController from './undevelopedController';
import stockOwnershipIncentiveController from './stockOwnershipIncentiveController';
import capitalStructureController from './capitalStructureController';
import stockHolderNumChangeController from './stockHolderNumChangeController';
import basicsController from './basicsController';
import eventOverviewController from './eventOverviewController';
import shareDividendController from './shareDividendController';
import competitiveEdgeController from './competitiveEdgeController';
import executiveAtlasController from './executiveAtlasController';
import top10StockHolderController from './top10StockHolderController';
import companyRiskInfoController from './companyRiskInfoController';
import shareholdersInOrDeController from './shareholdersInOrDeController';
import intellectualController from './intellectualController';
import noticeController from './noticeController';
import infoAndResearchController from './infoAndResearchController';
import valuationGradeController from './valuationGradeController';
import stockAnalysisController from './stockAnalysisController';
import pickStockByConditionController from './pickStockByConditionController';
import financialIndexController from './financialIndexController';
import moneyFlowController from './moneyFlowController';
import distributionOfChipsController from './distributionOfChipsController';
import similarKStockController from './similarKStockController';
import stockCompareController from './stockCompareController';
import businessEnvironmentController from './businessEnvironmentController';
import policyFilesController from './policyFilesController';
import policyContentController from './policyContentController';
import governmentData from './governmentDataController';
import latitude from './latitudeController';
import policyJournalism from './policyJournalismController';
import industryRelatedDataController from './industryRelatedDataController';
import industryIntroController from './industryIntroController';
import knowledgeController from './knowledgeController'
import industrySubController from './industrySubController';
import policyMeetingController from './policyMeetingControlle';
import policyInspectControlle from './policyInspectControlle';
import infoSearch from './infoSearchController';
import noViewController from './noViewController';
import universalAnswerController from './universalAnswerController';
import financialAnalysController from './financialAnalysController';
import universalSingleAnswerController from './universalSingleAnswerController';
import urlAnswerController from './urlAnswerController';
import reportAnswerController from './reportAnswerController';
import marginBalanceController from './marginBalanceController';
import restrictedStockUnlockController from './restrictedStockUnlockController';
import moneyLiquidityController from './moneyLiquidityController';
import executiveProfileController from './executiveProfileController';
import hkStockMoneyFlowController from './hkStockMoneyFlowController';
import materialAssetsController from './materialAssetsController';
import executivesChangeController from './executivesChangeController';
import employeeStockHoldingController from './employeeStockHoldingController';
import performanceChangeController from './performanceChangeController';
import achievementReportController from './achievementReportController';
import financialBuybackController from './financialBuybackController';
import kcbNewsController from './kcbNewsController';
import companyIndustryCompareController from './companyIndustryCompareController';
import financialMainIndexController from './financialMainIndexController';
import focusAnalysisController from './focusAnalysisController';
import drawingLotsStrategyController from './drawingLotsStrategyController';
import errorController from './errorController';

// let logger = require('../../utils/logger');

module.exports = {
  // 自由问答
  async freeQuestion(req, res, next){
    let params = req.query;
    params.organization = req.query.appKey || 'webPage';

    if(req.query.appKey === "appGZ"){
      params.organization = "appZXCX"
    }

    // 请求参数
    let configParams = {
      organization: params.organization,
      robotId: req.query.robotId || '',
      preview: req.query.preview || 'production' // 可选值为：test，production
    }

    // 读取配置
    let robotConfig = await semanticApiService.getRobotConfig(configParams).catch((error)=>{
      // console.log(error.response.status)
    })

    let sn = (new Date()).getTime();
    let info = await semanticApiService.freeQuestion(params).catch( error => {
      // console.log(error)
      // errorController.renderTemp(req, res, next, error)
    });
    // console.log(info)

    // 存储待用
    if (robotConfig) {
      // 拼域名
      if (robotConfig.data && robotConfig.data.logo) {
        robotConfig.data.assetsUrl = req.protocol+'://rxhui-corpus.oss-cn-beijing.aliyuncs.com/'
      }
      info.robotConfig = robotConfig
    }

    info.source = req.query.source || '';
    info.isPopup = req.query.isPopup;

    if (req.query.type === "json") { // 返回原始json数据
      res.json(info);
    }
    else if (params.organization === "appZXCX" || req.query.type === "mode") { // 最全模板
      module.exports.executeQuestion(req, res, next, info, sn);
    }
    else if (['webGZ'].indexOf(req.query.appKey) !== -1) { // 特定渠道
      module.exports.excuteGZQustion(req, res, next, info, sn);
    }
    else {
      // module.exports.executeQuestion(req, res, next, info, sn);
      module.exports.executeEztQuestion(req, res, next, info, sn); // 稳定模板
    }
  },

  // 固定问答
  async fixQuestion(req, res, next){
    let sn = (new Date()).getTime();
    let info = await semanticApiService.apiFixQuestion(req.query);
    module.exports.executeQuestion(req, res, next, info, sn);
  },

  // 知行问答的固定问答
  async fixJsonQuestion(req, res, next){
    let sn = (new Date()).getTime();
    let info = await semanticApiService.apiFixJsonQuestion(req.query);
    module.exports.executeQuestion(req, res, next, info, sn);
  },

  excuteGZQustion(req, res, next, info, sn){
    let type = info.answerResultType
    let showInteractiveView = commonUtil.isInteractiveView(type, req.query);
    let params = {
      appKey:req.query.appKey,
      noSource:req.query.noSource,
      sn:sn,
      type:req.query.type,
      stockInfo:{},
      showInteractiveView:showInteractiveView,
      resultId:info.spanId,
    }

    switch (type){
      case '事件概述':
        eventOverviewController.renderTemp(req, res, next, info, params);
        break;
      case '资讯搜索':
        infoSearch.renderTemp(req, res, next, info, params);
        break;
      case '政策内容列表':
        policyContentController.renderTemp(req, res, next, info, params);
        break;
      case '政府数据对比':
        governmentData.renderTemp(req, res, next, info, params);
        break;
      case '各地方指标维度':
        latitude.renderAll(req, res, next, info, params);
        break;
      case '全国指标维度':
        businessEnvironmentController.renderTemp(req,res,next,info, params);
        break;
      case '政策内容列表无点击':
        policyContentController.renderTemp(req, res, next, info,params,false);
        break;
      case '政策新闻列表':
        // policyFilesController.renderTemp(req, res, next, info,params);
        policyJournalism.renderTemp(req,res,next,info, params,false);
        break;
      case '会议有无点击':
        policyInspectControlle.renderTemp(req,res,next,info,params,false);
        break;
      case '会议有':
        policyInspectControlle.renderTemp(req,res,next,info,params,true);
        break;
      case '考察调研有无点击':
        policyMeetingController.renderTemp(req,res,next,info,params,false);
        break;
      case '考察调研有':
        policyMeetingController.renderTemp(req,res,next,info,params,true);
        break;
      default:
        info.data.answers = [];
        noViewController.renderTemp(req, res, next, info, params);
    }
  },

  // 返回答案处理
  executeQuestion(req, res, next, info, sn){
    // console.log(info)
    // 答案类型
    let type = info.answerResultType;
    // 判断该答案是否支持交互
    let showInteractiveView = commonUtil.isInteractiveView(type, req.query);
    // 模板用的参数
    let params = {
      appKey: req.query.appKey,
      appVersion: req.query.appVersion,
      appFrom: req.query.appFrom,
      noSource: req.query.noSource,
      sn: sn,
      type: type,
      stockInfo: {},
      showInteractiveView: showInteractiveView,
      resultId: info.spanId,
    };

    // 跳转类型的指令
    if(info.hasOwnProperty('jumpResult')){
      type = info.jumpResult.jumpResultType;
    }

    switch (type){
      // 假疫苗有什么影响  √
      case "事件影响":
        eventInfluenceController.renderTemp(req, res, next, info, params);
        break;

      // case "推荐列表": // 111
        // recommendedQuestion(json);
        // break;

        // 万科高管简介 // 有详情弹窗！
      // case "高管简介": ///
      //   executiveProfile(json, showInteractiveView);
      //   break;

      case "行业推荐":
        industryRecommandController.renderTemp(req, res, next, info, params);
        break;

      // case "概念":
      // case "概念股":
      // case "热点":
      // case "热点成分股":
      //   showConcepts(json, isPopup);
        // break;

      // case "个股所属板块":
        // showPlate(json, isPopup, showInteractiveView);
        // break;

      case "股票推荐":
        stockRecommandController.renderTemp(req, res, next, info, params);
        break;

      // 海利得所属题材  1
      case "所属题材":
        themeController.renderTemp(req, res, next, info, params);
        break;

      //海利得经营分析  增删自选与预警
      case "经营分析":
      case "业绩简评":
      case "投资建议":
      case "搜索回答":
      case "行业综评":
      case "行业":
      case "行业个股推荐":
      case '专家个股观点':
      case "专家行业观点":
        stockRelatedReportsController.renderTemp(req, res, next, info, params);
        break;

      //什么是股票质押回购  推荐问题链接
      case '基础知识':
        basicsController.renderTemp(req, res, next, info, params);
        break;

      //海利得公司主营  增删自选与预警
      case "公司主营":
        companyMainController.renderTemp(req, res, next, info, params);
        break;

      //大盘分析  没有交互
      // case "指数":
      // case "指数技术分析":
      case "上证指数综合评价":
      case "指数综评":
        sh_klineController.generateData(req, res, next, info, params);
        break;

      //海利得技术分析  增删自选与预警以及选股策略新问题，弹框说明
      // case "技术分析":
      case "个股技术分析":
        stockTechAnalyseController.renderTemp(req, res, next, info, params);
        break;

      // case '股东列表':
        // shareHolderList(json, showInteractiveView);
        // break;

      //海利得分红配股  增删自选与预警
      case '分红配股':
        shareDividendController.renderTemp(req, res, next, info, params);
        break;

      //海利得开盘价  增删自选与预警
      case "开盘价":
      case "收盘价":
      case "现价":
      case "最高价":
      case "最低价":
      case "涨跌幅":
      case "成交量":
      case "成交额":
      case "换手率":
      case "振幅":
      case "总市值":
      case "流通市值":
        stockPankouController.renderTemp(req, res, next, info, params);
        break;

      //海利得市盈率  增删自选与预警
      case "市盈率":
      case "市净率":
      case "市销率":
      case "权益利润率":
      case "加权平均成本":
      case "投资回报率":
      case "每股现金流":
      case "总资产收益率":
      case "毛利率":
      case "营业收入同比增长":
      case "净利润增长率":
      case "净资产收益率":
      case "资产负债率":
      case "流动负债率":
      case "流动比率":
      case "速动比率":
      case "总资产周转率":
      case "存货周转率":
      case "应收账款周转天数":
      case "每股净资产":
      case "营业收入":
      case "净利润":
      case "每股盈利":
      case "每股公积金":
      case "每股未分配利润":
      case "每股经营现金流":
      case "毛利润":
      case "归属母公司净利润":
      case "净利率":
      case "存货周转天数":
      case "应收账款占比":
      case "净利润率":
      case "现金流分数":
      case "现金流量允当比率":
      case "现金再投资比率":
      case "偿债能力分数":
      case "总资产":
      case "总负债":
      case "成长能力分数":
      case "运营能力分数":
      case "营业周期":
      case "盈利能力分数":
      case "政府补贴占净利润比例":
      case "营业收入增长率":
      case "重要客户集中度":
      case "营业利润":
      case "营业费用率":
      case "营业利润率":
      case "经营活动现金净流量":
      case "投资活动现金净流量":
      case "融资活动现金净流量":
      case "经营活动现金净流量/营业利润":
      case "自由现金流":
      case "净资本增长率":
      case "可持续增长率":
      case "流动资产周转率":
      case "固定资产周转率":
      case "应收账款周转率":
      case "总资产周转天数":
      case "政府补贴占净利润比":
      case "净资产":
      case "净资本":
      case "商誉风险":
      case "资产收益率":
        stockProfitDataController.renderTemp(req, res, next, info, params);
        break;

        // 万科运营周期
      case '财务指标':  //目前分成财务分析与财务数据，财务数据还没迁移到node端
        financialIndexController.renderTemp(req, res, next, info, params);
        break;

      //海利得基础报价   增删自选与预警
      case "基础报价数据是":
        baseQuotaController.renderTemp(req, res, next, info, params);
        break;

      //你们怎样  推荐问题链接
      case "呼叫投顾":
      case "无法回答":
        noAnswerController.renderTemp(req, res, next, info, params);
        break;

      //你好么  没有交互
      case "调侃问好":
      case "能力清单":
        sayHelloController.renderTemp(req, res, next, info, params);
        break;

      // 没有交互
      case "未开发":
        undevelopedController.renderTemp(req, res, next, info, params);
        break;

      //海利得公司概况  增删自选与预警
      case "公司概况":
        companyIntroController.renderTemp(req, res, next, info, params);
        break;

      //海利得办公地址  增删自选与预警
      case "办公地址":
        companyAddressController.renderTemp(req, res, next, info, params);
        break;

      //万科最近有什么大事  没有交互
      case '事件概述':
        eventOverviewController.renderTemp(req, res, next, info, params);
        break;

      //海利得竞争优势  增删自选与预警
      case '竞争优势':
        competitiveEdgeController.renderTemp(req, res, next, info, params);
        break;

      //海利得资金流向 增删自选与预警
      case '资金流向':
        moneyFlowController.renderTemp(req, res, next, info, params);
        break;

      //海利得棕评  增删自选与预警，弹出资讯详情，弹出行业概念，弹出财务面，资金面，技术面，打开一键研报
      case '个股综评':
        stockAnalysisController.renderTemp(req, res, next, info, params);
        break;

      //和一带一路相关的新闻有哪些  弹出资讯详情
      case '研报':
      case '资讯':
        infoAndResearchController.renderTemp(req, res, next, info, params);
        break;

      //搜一下一带一路  弹出资讯详情
      case '资讯搜索':
        infoSearch.renderTemp(req, res, next, info, params);
        break;

      //最近可申购的新股 没有交互
      case '通用答案':
        universalAnswerController.renderTemp(req, res, next, info, params);
        break;

      //海利得相似k线  增删自选与预警
      case '相似K线':
        similarKStockController.renderTemp(req, res, next, info, params);
        break;

      //万科的曾用名  没有交互
      case '通用单个答案':
      case '通用列表答案':
        universalSingleAnswerController.renderTemp(req, res, next, info, params);
        break;

      //钛白粉行业股票推荐  没有交互，但是会继续弹出添添其他自选股的新问题
      case '条件选股':
        pickStockByConditionController.renderTemp(req, res, next, info, params);
        break;

      //海利得筹码分布  增删自选与预警
      case '筹码分布':
        distributionOfChipsController.renderTemp(req, res, next, info, params);
        break;

      //海利得股东人数变化  增删自选与预警
      case '股东人数变化':
        stockHolderNumChangeController.renderTemp(req, res, next, info, params);
        break;

      //海利得股本结构  增删自选与预警，详情弹出股本结构图
      case '股本结构':
        capitalStructureController.renderTemp(req, res, next, info, params);
        break;

      //海利得公司高管   增删自选与预警
      case "公司高管":
        companyExecutivesController.renderTemp(req, res, next, info, params);
        break;

      //海利得股权激励 增删自选与预警
      case '股权激励':
        stockOwnershipIncentiveController.renderTemp(req, res, next, info, params);
        break;

      //海利得高管图谱  增删自选与预警
      case '高管图谱':
        executiveAtlasController.renderTemp(req, res, next, info, params);
        break;

      //海利得增持  增删自选与预警
      case '高管/股东增减持':
        shareholdersInOrDeController.renderTemp(req, res, next, info, params);
        break;

      //海利得十大股东  增删自选与预警
      case '十大股东':
        top10StockHolderController.renderTemp(req, res, next, info, params);
        break;

      //海利得估值评级 增删自选与预警
      case '估值评级':
        valuationGradeController.renderTemp(req, res, next, info, params);
        break;

      //海利得高管增持  增删自选与预警
      case '风险提示':
        companyRiskInfoController.renderTemp(req, res, next, info, params);
        break;

        // 问一支近期上市新股 如：晶丰明源
      case '新股综评':
        drawingLotsStrategyController.renderTemp(req, res, next, info, params);
        break;

      //海利得高新兴股票对比  没有交互
      case '股票对比是':
        stockCompareController.renderTemp(req, res, next, info, params);
        break;

      //海利得知识产权  增删自选与预警
      case '知识产权':
        intellectualController.renderTemp(req, res, next, info, params);
        break;

      //海利得公告  调用原生打开pdf
      case '公告':
        noticeController.renderTemp(req, res, next, info, params);
        break;

      //目前没有
      case '敏感信息':
        info.data.answers = [];
        info.data.answers.push('您的问题中含有敏感词，请重新输入');
        sayHelloController.renderTemp(req, res, next, info, params);
        break;

        // 万科融资融券
      case '融资融券':
        marginBalanceController.renderTemp(req, res, next, info, params);
        break;

        // 万科个股限售股解禁
      case '个股限售股解禁':
        restrictedStockUnlockController.renderTemp(req, res, next, info, params);
        break;

        // 万科流动性
      case '流动性':
        moneyLiquidityController.renderTemp(req, res, next, info, params);
        break;

        // 万科北上资金
      case '港股通资金流向':
        hkStockMoneyFlowController.renderTemp(req, res, next, info, params);
        break;

        // 万科竞争力数据
      case '竞争力数据':
        materialAssetsController.renderTemp(req, res, next, info, params);
        break;

        // gzmt高管变动
      case '高管变动':
        executivesChangeController.renderTemp(req, res, next, info, params);
        break;

        // dewl员工持股
      case '员工持股':
        employeeStockHoldingController.renderTemp(req, res, next, info, params);
        break;

        // dewl业绩预告
      case '业绩预告':
        performanceChangeController.renderTemp(req, res, next, info, params);
        break;

        // dewl业绩快报
      case '业绩快报':
        achievementReportController.renderTemp(req, res, next, info, params);
        break;

      //海利得财务分析
      case '财务分析':
        financialAnalysController.renderTemp(req, res, next, info, params);
        break;

        // dewl财务数据
      case '财务数据':
        financialMainIndexController.renderTemp(req, res, next, info, params);
        break;

        // dewl同行数据对比
      case '同行数据对比':
        companyIndustryCompareController.renderTemp(req, res, next, info, params);
        break;

        // 投资教育知识
      case '投资教育知识':
        kcbNewsController.renderTemp(req, res, next, info, params);
        break;

        // hcya回购信息
      case '回购信息':
        financialBuybackController.renderTemp(req, res, next, info, params);
        break;

      // 当前机会分析  推送用
      // case '当前机会分析': ///
        // opportunityMining(json, showInteractiveView);
        // break;

      // 房地产
      case '热点分析':
        focusAnalysisController.renderTemp(req, res, next, info,params);
        break;

      //
      // case '个股买入分析': ///
        // buyingAnalysisOfStock(json, showInteractiveView);
        // break;

      // case '财务风险-首页信号': ///
        // financialRisk(json, showInteractiveView);
        // break;

      //海利得上下游   没有交互
      case "公司上下游":
      case "行业上下游":
        knowledgeController.renderTemp(req, res, next, info,params);
        break;

        //汽车行业内外部环境分析  没有交互，有弹出详情
      case "行业数据":
        industryRelatedDataController.renderTemp(req, res, next, info,params);
        break;

        //锂电池介绍  没有交互
      case '行业简介':
        industryIntroController.renderTemp(req, res, next, info,params);
        break;

        //锂电池这个行业包含三元锂吗 没有交互
      case "行业细分":
        industrySubController.renderTemp(req, res, next, info,params);
        break;

        //三农政策  弹出资讯详情
      case '政策文件列表':
        policyFilesController.renderTemp(req, res, next, info, params);
        break;

        //习近平会见法国总理菲利普期间谈判了什么   弹出资讯详情
      case '政策内容列表':
        policyContentController.renderTemp(req, res, next, info, params);
        break;

        //贵州云南gdp对比   没有交互
      case '政府数据对比':
        governmentData.renderTemp(req, res, next, info, params);
        break;

        //贵州gdp  没有交互
      case '各地方指标维度':
        latitude.renderAll(req, res, next, info, params);
        break;

        //全国gdp  没有交互
      case '全国指标维度':
        businessEnvironmentController.renderTemp(req,res,next,info, params);
        break;

        //央行例会关于货币政策的最新表述  没有交互
      case '政策内容列表无点击':
        policyContentController.renderTemp(req, res, next, info,params,false);
        break;

      case '政策新闻列表':  //已经合并了
        // policyFilesController.renderTemp(req, res, next, info,params);
        policyJournalism.renderTemp(req,res,next,info, params,false);
        break;

        //各省委常委会召开的关于两不愁三保障的会议有哪些  无交互
      case '会议有无点击':
        policyInspectControlle.renderTemp(req,res,next,info,params,false);
        break;

        //贵州会议  弹出资讯详情
      case '会议有':
        policyInspectControlle.renderTemp(req,res,next,info,params,true);
        break;

        //今年都有哪些部长考察了雄安  没有交互
      case '考察调研有无点击':
        policyMeetingController.renderTemp(req,res,next,info,params,false);
        break;

        //习近平考察调研  弹出资讯详情
      case '考察调研有':
        policyMeetingController.renderTemp(req,res,next,info,params,true);
        break;

      case '页面跳转答案':
        urlAnswerController.renderTemp(req, res, next, info, params);
        break;

      case '数据中心答案': // 答案为智能报告
        reportAnswerController.renderTemp(req, res, next, info, params);
        break;

      default:
        res.json(info);
        // info.data = {};
        // info.data.answers = [];
        // info.data.answers.push('小E暂时回答不了这个问题')
        // sayHelloController.renderTemp(req, res, next, info, params);
        break;
    }
  },

  async executeEztQuestion(req, res, next, info, sn){
    // console.log(info)
    // 答案类型
    let type = info.answerResultType;

    // 判断该答案是否支持交互
    let showInteractiveView = commonUtil.isInteractiveView(type, req.query);

    // 模板用的参数
    let params = {
      appKey:req.query.appKey,
      appVersion: req.query.appVersion,
      appFrom: req.query.appFrom,
      noSource:req.query.noSource,
      mode: req.query.mode,
      sn:sn,
      type: type,
      stockInfo:{},
      showInteractiveView:showInteractiveView,
      resultId:info.spanId,
    };

    // 跳转类型的指令
    if(info.hasOwnProperty('jumpResult')){
      type = info.jumpResult.jumpResultType;
    }

    switch (info.answerResultType) {
      // 假疫苗有什么影响  √
      // case "事件影响":
      //   eventInfluenceController.renderTemp(req, res, next, info, params);
      //   break;
      //
      // case "行业推荐":
      //   industryRecommandController.renderTemp(req, res, next, info, params);
      //   break;

      case "公司上下游":
      case "行业上下游":
        knowledgeController.renderTemp(req, res, next, info,params);
        break;

      case "行业数据":
        industryRelatedDataController.renderTemp(req, res, next, info,params);
        break;

      case '行业简介':
        industryIntroController.renderTemp(req, res, next, info,params);
        break;

      case "行业细分":
        industrySubController.renderTemp(req, res, next, info,params);
        break;

      case "基础报价数据是":
        baseQuotaController.renderTemp(req, res, next, info, params);
        break;

      case "所属题材":
        themeController.renderTemp(req, res, next, info, params);
        break;

      case "开盘价":
      case "收盘价":
      case "现价":
      case "最高价":
      case "最低价":
      case "涨跌幅":
      case "成交量":
      case "成交额":
      case "换手率":
      case "振幅":
      case "总市值":
      case "流通市值":
        stockPankouController.renderTemp(req, res, next, info,params);
        break;

      case "市盈率":
      case "市净率":
      case "市销率":
      case "权益利润率":
      case "加权平均成本":
      case "投资回报率":
      case "每股现金流":
      case "总资产收益率":
      case "毛利率":
      case "营业收入同比增长":
      case "净利润增长率":
      case "净资产收益率":
      case "资产负债率":
      case "流动负债率":
      case "流动比率":
      case "速动比率":
      case "总资产周转率":
      case "存货周转率":
      case "应收账款周转天数":
      case "每股净资产":
      case "营业收入":
      case "净利润":
      case "每股盈利":
      case "每股公积金":
      case "每股未分配利润":
      case "每股经营现金流":
      case "毛利润":
      case "归属母公司净利润":
      case "净利率":
      case "存货周转天数":
      case "应收账款占比":
      case "净利润率":
      case "现金流分数":
      case "现金流量允当比率":
      case "现金再投资比率":
      case "偿债能力分数":
      case "总资产":
      case "总负债":
      case "成长能力分数":
      case "运营能力分数":
      case "营业周期":
      case "盈利能力分数":
      case "政府补贴占净利润比例":
      case "营业收入增长率":
      case "重要客户集中度":
      case "营业利润":
      case "营业费用率":
      case "营业利润率":
      case "经营活动现金净流量":
      case "投资活动现金净流量":
      case "融资活动现金净流量":
      case "经营活动现金净流量/营业利润":
      case "自由现金流":
      case "净资本增长率":
      case "可持续增长率":
      case "流动资产周转率":
      case "固定资产周转率":
      case "应收账款周转率":
      case "总资产周转天数":
      case "政府补贴占净利润比":
      case "净资产":
      case "净资本":
      case "商誉风险":
      case "资产收益率":
        stockProfitDataController.renderTemp(req, res, next, info, params);
        break;

      case '政策文件列表':
        policyFilesController.renderTemp(req, res, next, info,params);
        // policyInspectControlle.renderTemp(req,res,next,info,params);
        break;

      case '政策内容列表':
        policyContentController.renderTemp(req, res, next, info,params,true);
        break;

      case '政策内容列表无点击':
        policyContentController.renderTemp(req, res, next, info,params,false);
        break;

      case '政府数据对比':
        governmentData.renderTemp(req, res, next, info,params);
        break;

      case '各地方指标维度':
        latitude.renderAll(req, res, next, info,params);
        break;

      case '全国指标维度':
        businessEnvironmentController.renderTemp(req,res,next,info,params);
        break;

      case '政策新闻列表':
        // policyFilesController.renderTemp(req, res, next, info,params);
        policyJournalism.renderTemp(req,res,next,info,params);
        break;

      case '会议有无点击':
        policyInspectControlle.renderTemp(req,res,next,info,params,false);
        break;

      case '会议有':
        policyInspectControlle.renderTemp(req,res,next,info,params,true);
        break;

      case '考察调研有无点击':
        policyMeetingController.renderTemp(req,res,next,info,params,false);
        break;

      case '考察调研有':
        policyMeetingController.renderTemp(req,res,next,info,params,true);
        break;

      case '资讯搜索':
        infoSearch.renderTemp(req, res, next, info, params);
        break;

      //海利得财务分析
      // case '财务分析':
      //   financialAnalysController.renderTemp(req, res, next, info, params);
      //   break;

      case '人物简介':
        executiveProfileController.renderTemp(req, res, next, info, params);
        break;

      case '页面跳转答案':
        urlAnswerController.renderTemp(req, res, next, info, params);
        break;

      case '数据中心答案': // 答案为智能报告
        reportAnswerController.renderTemp(req, res, next, info, params);
        break;

      default:
        res.json(info);
    }
  }

};
