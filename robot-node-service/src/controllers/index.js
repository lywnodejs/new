var controller = {
  question: require('./question'),
  questionWeb: require('./questionweb'),
  questionWps: require('./questionWps'),
  questionWrite: require('./questionWrite'),
  quota: require('./quota'),
  error: require('./error'),
  newsInfo: require('./newsInfo'),
  log: require('./log'),

  freeQustionController:require('./questionControllers/freeQustionController'),
  sh_klineController: require('./questionControllers/sh_klineController'),
  stockRecommandController: require('./questionControllers/stockRecommandController'),
  stockTechAnalyseController: require('./questionControllers/stockTechAnalyseController'),
  companyExecutivesController:require('./questionControllers/companyExecutivesController'),
  baseQuotaController:require('./questionControllers/baseQuotaController'),
  themeController:require('./questionControllers/themeController'),
  companyMainController:require('./questionControllers/companyMainController'),
  companyIntroController:require('./questionControllers/companyIntroController'),
  companyAddressController:require('./questionControllers/companyAddressController'),
  stockRelatedReportsController:require('./questionControllers/stockRelatedReportsController'),
  stockPankouController:require('./questionControllers/stockPankouController'),
  stockProfitDataController:require('./questionControllers/stockProfitDataController'),
  capitalStructureController:require('./questionControllers/capitalStructureController'),

  policyAll:require('./questionControllers/policyAll'),
  businessEnvironmentController:require('./questionControllers/businessEnvironmentController'),
  policyFiles:require('./questionControllers/policyFilesController'),
  policyInterfaces:require('./policyInterfaces'),
  policyJournalism:require('./questionControllers/policyJournalismController'),

  //模版controller
  templateController:require('./templateControllers/templateController'),

  companyIndustryCompare: require('./questionControllers/companyIndustryCompareController'),
  financialMainIndex: require('./questionControllers/financialMainIndexController')

};

module.exports = controller;


