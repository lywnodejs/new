let interfaceConfig = {
    companyInfo: {
        name: "公司简介",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "公司简介-一键研报",
        organization: "appEzt",
        templateName: "companyInfoView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    baseInfo: {},
    stockHolder: {
        name: "股东户数",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "股东人数变化",
        organization: "appEzt",
        templateName: "stockHolderView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/toolsUtil",
            "/static/js/charts/lineColumnChart",
            "/static/js/libs/7.0/highstock",
            "/static/js/utils/resizeUtils"
        ],
    },
    financialAnalysis: {
        name: "财务全景",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "财务分析是",
        organization: "appEzt",
        templateName: "financialAnalysisView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/libs/7.0/highstock",
            "/static/js/libs/7.0/highcharts-more",
            "/static/js/utils/toolsUtil",
            "/static/js/charts/polygonChart",
            "/static/js/charts/baseChart",
            "/static/js/utils/resizeUtils"
        ],
    },
    stockTech: {
        name: "个股技术分析",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "个股技术分析",
        organization: "appEzt",
        templateName: "stockTechView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/charts/jKline_stock_report_robot",
            "/static/js/libs/7.0/highstock",
            "/static/js/utils/toolsUtil",
            "/static/js/utils/resizeUtils"
        ],
    },
    executive: {
        name: "高管变动",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "高管变动",
        organization: "appEzt",
        templateName: "executiveView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/toolsUtil",
            "/static/js/utils/resizeUtils"
        ],
    },
    northboundFunds: {
        name: "北上资金",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "北上近20个交易日",
        organization: "appEzt",
        templateName: "northboundFundsView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/toolsUtil",
            "/static/js/utils/resizeUtils"
        ],
    },
    cashFlow: {
        name: "流动性",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "流动性",
        organization: "appEzt",
        templateName: "cashFlowView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/toolsUtil",
            "/static/js/utils/resizeUtils"
        ]
    },
    financing: {
        name: "融资融券",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "融资融券",
        organization: "appEzt",
        templateName: "financingView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/toolsUtil",
            "/static/js/utils/resizeUtils"
        ]
    },
    industryConcept: {
        name: "行业概念",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "行业概念-一键研报",
        organization: "appEzt",
        templateName: "industryConceptView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/toolsUtil"
        ]
    },
    scarcity: {
        name: "标的的稀缺性",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "标的稀缺性-一键研报",
        organization: "appEzt",
        templateName: "scarcityView"
    },
    industryProsperity: {
        name: "行业景气度",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "行业景气度-一键研报",
        organization: "appEzt",
        templateName: "industryProsperityView",
    },
    financialIndex: {
        name: "财务指标",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "财务指标-一键研报",
        organization: "appEzt",
        templateName: "financialIndexView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/libs/7.0/highstock",
            "/static/js/charts/splineAndColumnChart",
            "/static/js/utils/toolsUtil",
            "/static/js/utils/timeUtil",
        ]
    },
    // judicialDisputes: {
    //     name: "司法纠纷",
    //     subjectName: "",
    //     subjectMarket: "",
    //     subjectCode: "",
    //     subjectType: "股票",
    //     predicateType: "个股港股通北上资金",
    //     organization: "appEzt",
    //     templateName: "judicialDisputesView",
    //     jsArray: [
    //         "/static/js/libs/jquery-1.11.2.min",
    //         "/static/js/libs/7.0/highstock",
    //         "/static/js/charts/twoLatitudeHistogram"
    //     ]
    // },
    // industrialSignal: {
    //     name: "产业信号",
    //     subjectName: "",
    //     subjectMarket: "",
    //     subjectCode: "",
    //     subjectType: "股票",
    //     predicateType: "个股港股通北上资金",
    //     organization: "appEzt",
    //     templateName: "industrialSignalView",
    //     jsArray: [
    //         "/static/js/libs/jquery-1.11.2.min",
    //         "/static/js/libs/7.0/highstock",
    //         "/static/js/charts/columnAndSplineChart",
    //         "/static/js/utils/toolsUtil",
    //     ]
    // },
    focusSignal: {
        name: "焦点信号",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "焦点-一键研报",
        organization: "appEzt",
        templateName: "focusSignalView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/libs/7.0/highstock",
            "/static/js/charts/splineAndColumnChart",
            "/static/js/utils/toolsUtil",
        ]
    },
    informationEvent: {
        name: "资讯事件",
        templateName: "informationEventView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/timeUtil",
        ]
    },
    ZXCXHeaderScreen: {
        name: "政策搜索头部筛选",
        templateName: "ZXCXHeaderScreenView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/jdate.min"
        ]
    },
    ZXCXHeaderScreenList: {
        name: "政策搜索列表",
        templateName: "ZXCXHeaderScreenListView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/timeUtil",
        ]
    },
    knowMap: {
        name: "知识图谱",
        templateName: "knowMapView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/timeUtil",
            "/static/js/utils/toolsUtil",
        ]
    },
    infomationMes: {
        name: "资讯列表",
        templateName: "informationMesView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/timeUtil",
        ]
    },
    stockOwnershipIncentive: {
        name: "股权激励",
        subjectName: "",
        subjectMarket: "",
        subjectCode: "",
        subjectType: "股票",
        predicateType: "股权激励",
        templateName: "stockOwnershipIncentiveView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/timeUtil",
        ]
    },
    exchangeLetter: {
        name: "交易所问询函",
        templateName: "listView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    holdPositionPlan: {
        name: "员工持股",
        templateName: "listView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    eventEvolve:{
        name: "事件进展",
        templateName: "eventEvolveView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/toolsUtil"
        ]
    },
    knowAtlas:{
        name: "知识图谱关系",
        templateName: "knowAtlasView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/libs/echarts",
        ]
    },
    industrySignal:{
        name: "产业",
        templateName: "industrySignalView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "/static/js/utils/toolsUtil"
        ]
    },
    autoReportDetail:{
        name: "行业简介",
        templateName: "autoReportDetailView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    autoReportDetailUpStream:{
        name: "行业上游",
        templateName: "autoReportDetailUpStreamView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    autoReportDetailDownStream:{
        name: "行业下游",
        templateName: "autoReportDetailDownStreamView",//"autoReportDetailDownStreamView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    autoReportIndustryTrend:{
        name: "行业发展趋势",
        templateName: "autoReportIndustryTrendView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min",
            "//weblibs.rxhui.com/compLibrary_rxh/js/yy_tab.js"
        ]
    },
    autoReportIndustryMarketSize:{
        name: "行业市场规模",
        templateName: "autoReportIndustryTrendView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    autoReportIndustryProfitabilityAnalysis:{
        name: "行业成本和盈亏分析",
        templateName: "autoReportIndustryTrendView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    autoReportIndustryProductPrice:{
        name: "行业内产品价格",
        templateName: "autoReportIndustryTrendView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    autoReportIndustryFocus:{
        name: "行业竞争格局",
        templateName: "autoReportIndustryTrendView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    autoReportIndustryInvestmentAdvice:{
        name: "行业投资建议",
            templateName: "autoReportIndustryTrendView",
            jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    autoReportIndustryRecommendStock:{
        name: "行业投资建议",
        templateName: "autoReportIndustryTrendView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    autoReportIndustryExternalEnvironment:{
        name: "行业外部环境",
        templateName: "autoReportIndustryTrendView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    autoReportIndustryLeadingAnalysis:{
        name: "行业龙头分析",
        templateName: "autoReportIndustryTrendView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    autoReportIndustryCapacity:{
        name: "行业产能",
        templateName: "autoReportIndustryTrendView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
    autoReportCompanyList:{
        name: "行业上市公司",
        templateName: "autoReportCompanyListView",
        jsArray: [
            "/static/js/libs/jquery-1.11.2.min"
        ]
    },
}

export default {
    interfaceConfig
};
