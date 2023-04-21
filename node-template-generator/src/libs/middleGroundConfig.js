let middleGroundConfig = {
  table: {
    name: "表单",
    templateName: "tableView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/utils/platform-adapter"
    ]
  },
  histogram: {
    name: "柱状图",
    templateName: "splineAndColumnView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/charts/splineAndColumnChart",
      "/static/js/libs/7.0/highstock",
      "/static/js/utils/toolsUtil"
    ]
  },
  lineGraph: {
    name: "线状图",
    templateName: "splineAndColumnView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/charts/splineAndColumnChart",
      "/static/js/libs/7.0/highstock",
      "/static/js/utils/toolsUtil"
    ]
  },
  splineAndColumn: {
    name: "混合图",
    templateName: "splineAndColumnView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/charts/splineAndColumnChart",
      "/static/js/libs/7.0/highstock",
      "/static/js/utils/toolsUtil"
    ]
  },
  pie: {
    name: "",
    templateName: "pieView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/charts/pieChart",
      "/static/js/libs/7.0/highstock",
      "/static/js/utils/toolsUtil"
    ]
  },
  text: {
    name: "文本",
    templateName: "textView"
  },
  klineChart: {
    name: "k线图",
    templateName: "klineChartView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/libs/7.0/highstock",
      "/static/js/libs/highcharts-zh_CN",
      "/static/js/charts/klineChart",
      "/static/js/utils/timeUtil"
    ]
  },
  speechTemplate: {
    name: "话术",
    templateName: "speechTemplateView",
    jsArray: []
  },
  riskNotice: {
    name: "风险提示",
    templateName: "riskNoticeView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/utils/timeUtil",
    ]
  },
  autoReportDetail: {
    name: "行业简介",
    templateName: "autoReportDetailView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min"
    ]
  },
  autoReportDetailUpStream: {
    name: "行业上游",
    templateName: "autoReportDetailUpStreamView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min"
    ]
  },
  autoReportDetailDownStream: {
    name: "行业下游",
    templateName: "autoReportDetailDownStreamView",//"autoReportDetailDownStreamView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min"
    ]
  },
  autoReportIndustryTrend: {
    name: "行业发展趋势",
    templateName: "autoReportIndustryTrendView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "//weblibs.rxhui.com/compLibrary_rxh/js/yy_tab"
    ]
  },
  autoReportIndustryMarketSize: {
    name: "行业市场规模",
    templateName: "autoReportIndustryTrendView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min"
    ]
  },
  autoReportIndustryProfitabilityAnalysis: {
    name: "行业成本和盈亏分析",
    templateName: "autoReportIndustryTrendView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min"
    ]
  },
  autoReportIndustryProductPrice: {
    name: "行业内产品价格",
    templateName: "autoReportIndustryTrendView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min"
    ]
  },
  autoReportIndustryFocus: {
    name: "行业竞争格局",
    templateName: "autoReportIndustryTrendView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min"
    ]
  },
  autoReportIndustryInvestmentAdvice: {
    name: "行业投资建议",
    templateName: "autoReportIndustryTrendView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min"
    ]
  },
  autoReportIndustryRecommendStock: {
    name: "行业投资建议",
    templateName: "autoReportIndustryTrendView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min"
    ]
  },
  autoReportIndustryExternalEnvironment: {
    name: "行业外部环境",
    templateName: "autoReportIndustryTrendView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min"
    ]
  },
  autoReportIndustryLeadingAnalysis: {
    name: "行业龙头分析",
    templateName: "autoReportIndustryTrendView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  autoReportIndustryCapacity: {
    name: "行业产能",
    templateName: "autoReportIndustryTrendView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min"
    ]
  },
  autoReportCompanyList: {
    name: "行业上市公司",
    templateName: "autoReportCompanyListView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min"
    ]
  },
  robotChartKLine: {
    name: "智能小e k线模版",
    templateName: "robotChartKLineView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/charts/jKline_stock_report_robot",
      "/static/js/libs/7.0/highstock"
    ]
  },
  robotChartIndex: {
    name: "智能小e技术指标",
    templateName: "robotChartIndexView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/charts/jKline_stock_report_robot",
      "/static/js/libs/7.0/highstock"
    ]
  },
  valuationGrade: {
    name: "智能分析",
    templateName: "valuationGrade",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/libs/7.0/highstock",
      "/static/js/charts/splineAndColumnChart",
    ]
  },
  informationListView: {
    name: "其他组件 公告司法纠纷组件 ",
    templateName: "informationListView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/utils/platform-adapter"
    ]
  },
  otherBoardVote: {
    name: "其他组件 董事会监事会投票组件",
    templateName: "otherBoardVoteView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  paragraphView: {
    name: "定期报告内容搜索 一致行动人",
    templateName: "paragraphView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  bigSearch: {
    name: "大搜索组件",
    templateName: "bigSearchView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/utils/timeUtil",
      "/static/js/utils/platform-adapter"
    ]
  },
  marketPredictionView: {
    name: "市场预测数据",
    templateName: "marketPredictionView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/utils/timeUtil",
      "/static/js/utils/platform-adapter"
    ]
  },
  bigSearchEvent: {
    name: "大搜索组件",
    templateName: "bigSearchEventView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/utils/timeUtil",
      "/static/js/utils/platform-adapter"
    ]
  },
  knowAtlas: {
    name: "知识图谱关系",
    templateName: "knowAtlasView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/libs/echarts",
      "/static/js/utils/platform-adapter"
    ]
  },
  ParticipateHoldingCompany: {
    name: "参控股公司",
    templateName: "ParticipateHoldingCompanyView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  robotFinanceIndex: {
    name: "小e财务数据",
    templateName: "robotFinanceIndex",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  realizableAssets: {
    name: "可变现资产",
    templateName: "realizableAssets",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
    robotAnalysisDataIs: {
        name: "数据是",
        templateName: "robotAnalysisDataIs"
    },
  financeCycle: {
    name: "财报组件",
    templateName: "financialStatement",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  contrastStock: {
    name: "指数股票对比",
    templateName: "contrastStockView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/libs/7.0/highstock",
    ]
  },

  stockMoneyFlowRank:{
    name: "资金净流入排名",
    templateName: "stockMoneyFlowRankView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  stockMoneyFlow:{
    name: "北上资金净流排名",
    templateName: "stockMoneyFlowView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  companyInfo:{
    name: "公司简介",
    templateName: "companyInfoView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  companySummery:{
    name: "公司概况",
    templateName: "companySummeryView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "https://weblibs.rxhui.com/compLibrary_rxh/js/yy_compLibrary_rxh2"
    ]
  },

  knowledge:{
    name: "知识库",
    templateName: "knowledgeView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "https://weblibs.rxhui.com/compLibrary_rxh/js/yy_compLibrary_rxh2"
    ]
  },

  companyTopHolder:{
    name: "十大股东",
    templateName: "companyTopHolderView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  companyTopHolderAddReduce:{
    name: "股东增减持",
    templateName: "companyTopHolderAddReduceView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },


  companyBuy:{
    name: "公司回购",
    templateName: "companyBuyView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  companyHolderChange:{
    name: "股东变化",
    templateName: "companyHolderChangeView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/libs/7.0/highstock",
      "/static/js/charts/lineColumnChart"
    ]
  },

  companyHolderSpeech:{
    name: "股东变化话术",
    templateName: "companyHolderSpeechView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  industryProsperity:{
    name: "股东变化话术",
    templateName: "industryProsperityView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  executive:{
    name: "行业景气度,标的稀缺性",
    templateName: "executiveView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  marginTrading:{
    name: "两融排行",
    templateName: "marginTradingView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  marginTradingTop:{
    name: "融资排行",
    templateName: "marginTradingTopView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  mobility:{
    name: "流动性排名",
    templateName: "mobilityView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  mobilityList:{
    name: "流动性排行",
    templateName: "mobilityListView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  industryConcept: {
    name: "行业概念",
    predicateType: "行业概念-一键研报",
    templateName: "industryConceptView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "/static/js/utils/toolsUtil"
    ]
  },

  shareBonusList: {
    name: "分红送股",
    predicateType: "行业概念-一键研报",
    templateName: "shareBonusListView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  eventList: {
    name: "个股资讯",
    predicateType: "",
    templateName: "eventListView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  riskList: {
    name: "风险公告",
    predicateType: "",
    templateName: "riskListView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  incentive: {
    name: "股权激励",
    predicateType: "",
    templateName: "incentiveView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  riskDetail: {
    name: "股权激励详情",
    predicateType: "",
    templateName: "riskDetailView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "https://weblibs.rxhui.com/compLibrary_rxh/js/yy_compLibrary_rxh2"
    ]
  },

  performanceList: {
    name: "业绩预告",
    predicateType: "",
    templateName: "performanceListView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },

  seniorList: {
    name: "高管",
    predicateType: "",
    templateName: "seniorListView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  seniorGraphList: {
    name: "高管图谱",
    predicateType: "",
    templateName: "seniorGraphListView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  structureStock: {
    name: "股本结构话术",
    predicateType: "",
    templateName: "structureStockView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  structureStockList: {
    name: "股本结构",
    predicateType: "",
    templateName: "structureStockListView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  restrictedStock: {
    name: "个股限售股解禁",
    predicateType: "",
    templateName: "restrictedStockView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  restrictedStockList: {
    name: "个股限售股解禁列表",
    predicateType: "",
    templateName: "restrictedStockListView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  robotComment: {
    name: "小e点评",
    predicateType: "",
    templateName: "robotCommentView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  performanceBulletin: {
    name: "业绩快报",
    predicateType: "",
    templateName: "performanceBulletinView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  robotStockHeader: {
    name: "股权质押头部",
    predicateType: "",
    templateName: "robotStockHeaderView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
    ]
  },
  competitiveEdge: {
    name: "竞争优势",
    predicateType: "",
    templateName: "competitiveEdgeView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "https://weblibs.rxhui.com/compLibrary_rxh/js/yy_compLibrary_rxh2"
    ]
  },
  informationEvent: {
    name: "事件数据",
    predicateType: "",
    templateName: "informationEventView",
    jsArray: [
      "/static/js/libs/jquery-1.11.2.min",
      "https://weblibs.rxhui.com/compLibrary_rxh/js/yy_compLibrary_rxh2"
    ]
  },
};

export default {
  middleGroundConfig
};

