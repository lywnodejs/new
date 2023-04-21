var controller = require('./controllers/index');

module.exports = function (app) {
  // 小E首页
  app.get('/', controller.question.index);
  // 小E pc web版首页
  app.get('/web', controller.questionWeb.index);
  // 小E 金山WPS入口
  app.get('/wps', controller.questionWps.index);
  // 智能写作接口
  app.get('/write', controller.questionWrite.index);

  // 条件选股页面
  app.get('/conditions/pickConditions', controller.question.pickConditions);
  // 选择行业页面
  app.get('/conditions/pickIndustry', controller.question.pickIndustry);
  // 选股结果页面
  app.get('/conditions/pickStockResult', controller.question.pickStockResult);
  // 筹码分页页面
  app.get('/distOfChips', controller.question.distOfChips);
  // 为兼容原生底部‘条件选股’入口，将路由强制转到新地址
  app.get('/master/conditions/*', function (req, res, next) {
    res.redirect('/conditions/pickConditions?x=jianrong')
  });

/************************ api ************************************/
  // 自由问答
  app.get('/api/freeQuestion', controller.freeQustionController.freeQuestion);
  // 固定问答
  app.get('/api/qa/fixQustion', controller.freeQustionController.fixQuestion);
  // 固定问答-json
  app.get('/api/qa/fixJsonQuestion', controller.freeQustionController.fixJsonQuestion);
  // 固定问答-z政策
  app.get('/api/qa/policyQuestion', controller.freeQustionController.fixJsonQuestion);

  // 日志
  app.post('/api/log/save', controller.log.save);

  app.get('/error', controller.error.errorHandler);

  app.get('/api/stock', controller.question.stock);
  app.get('/api/stock/recommand', controller.question.stockRecommand);
  app.get('/api/index/tech', controller.question.sseTech);
  app.get('/api/stock/fix', controller.question.apiQaQuestion);
  app.get('/riskNotices/companyRisk/riskNotices', controller.question.apiRiskNotices);  //风险信息
  app.get('/report/detail', controller.newsInfo.apiReportDetail);  //研报详情
  app.get('/news/detail', controller.newsInfo.apiNewsDetail);  //资讯详情
  app.get('/bigSearch/detail', controller.newsInfo.apiBigSearchDetail);  //大搜索详情
  app.get('/api/qa/stock', controller.question.apiStockDetail);  //个股所属题材

  app.get('/api/stock/areaprice', controller.question.apiStockAreaPrice);

  //行情
  app.get('/api/stock/quota', controller.quota.stockQuota);
  app.get('/api/stock/kline', controller.quota.getKline);
  app.get('/api/stock/getprice', controller.quota.getSymbolPrice);

  // app.post('/user/login', controller.user.loginPost);

  app.get('/api/stock/recommand/template', controller.stockRecommandController.stockRecommand);   //行业推荐
  app.get('/api/sh_kline/template', controller.sh_klineController.sh_kline);   //大盘分析
  app.get('/api/stock/tech/analyse', controller.stockTechAnalyseController.stockTechAnalyse);  //个股技术分析
  app.get('/api/stock/companyExecutives', controller.companyExecutivesController.companyExecutives);  //高管简介
  app.get('/api/stock/baseQuota', controller.baseQuotaController.baseQuota);   //个股基础报价
  app.get('/api/stock/theme', controller.themeController.theme);   //个股题材
  app.get('/api/stock/companyMain', controller.companyMainController.company);  //公司主营
  app.get('/api/stock/companyIntro', controller.companyIntroController.intro);  //公司介绍
  app.get('/api/stock/companyAddress', controller.companyAddressController.address);  //公司地址

  //政策问答
  app.get('/api/policy/policyAll', controller.policyAll.renderTemp);  //政策问答---提前加载js脚本和样式
  app.get('/api/policy/businessEmvironment', controller.businessEnvironmentController.renderTemp);  //政策问答---营商环境
  app.get('/api/policy/policyFiles', controller.policyFiles.renderTemp);  //政策问答---政策文件
  app.get('/api/policy/policyJournalism', controller.policyJournalism.renderTemp);  //政策问答---政策新闻
  app.get('/api/policyInterfaces', controller.policyInterfaces.policyInterfaces);  //政策问答---接口-获取政策数据
  app.get('/api/policyInterfacesDetail', controller.policyInterfaces.policyInterfacesDetail);  //政策问答---接口-获取政策详情页数据
  app.get('/api/getDateYear', controller.policyInterfaces.getDateYear);  //政策问答---接口-请求其他年份

  //点赞/踩
  app.get('/api/feedback', controller.policyInterfaces.feedback);

  //模版接口
  app.get('/api/template', controller.templateController.search);

  // 财务：同行数据对比
  app.get('/financeAnalysis/financeInduCompare', controller.companyIndustryCompare.financeInduCompare);
  // 财务数据
  app.get('/financeAnalysis/financeReport', controller.financialMainIndex.financeReport);

};

