/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class SemanticApiService {
  constructor(clientAxios) {
    this.http = clientAxios
  }

  freeQuestion(params){
    let url = '/api/qa'
    return this.http.getJson(url,params);
  }

  // 智能写作 post
  writeQuestion(params){
    let url = '/api/write'
    return this.http.postJson(url,params);
  }

  apiFixQuestion(params){
    let url = '/api/qa/fix'
    return this.http.getJson(url,params);
  }
  apiFixJsonQuestion(params){
    let url = '/api/qa/fixJson'
    return this.http.getJson(url,params);
  }

  apiRiskNotices(params){
    let url = '/companyRisk/riskNotices'
    return this.http.getJson(url,params);
  }

  apiStockDetail(params){
    let url = '/api/qa/stock/' + params.marketType + '/' + params.stockCode;
    return this.http.getJson(url,params);
  }

  // apiReportDetail(params){
  //   let url = '/companyRisk/riskNotices'
  //   return this.http.getJson(url,params);
  // }
  //
  // apiNewsDetail(params){
  //   let url = '/companyRisk/riskNotices'
  //   return this.http.getJson(url,params);
  // }

  /**
   * @description: 获取政府搜索数据
   * @param {type}
   * @return:
   */
  policyInterfaces(params){
    let url = `/policy/search/`
    return this.http.getJson(url,params.query);
  }

  /**
   * @description: 获取政府搜索数据详情页
   * @param {type}
   * @return:
   */
  policyInterfacesDetail(params){
    let url = `/information/detail/${params.query.id}`
    return this.http.getJson(url);
  }

  /**
   * @description:
   * @param {type}
   * @return:
   */
  feedback(params){
    let url = `/api/feedback/score`;
    return this.http.getJson(url,params.query);
  }

  /**
   * @description:
   * @param {type}
   * @return:
   */
  getDateYear(params){
    let url = `/api/qa/fixJson`;
    return this.http.getJson(url,params.query);
  }

  apiBigSearchDetail(params){
    let url = '/bigSearch';
    return this.http.getJson(url,params);
  }

  /**
   * 获取机器人配置
   * @param params：organization，robotId，preview
   * @returns {Promise}
   */
  getRobotConfig(params){
    let url = '/robot/manage/configuration';
    return this.http.getJson(url,params);
  }

  /**
   * 机器人首页推荐问题获取
   * @param params: organization，robotId，preview
   * @returns {Promise}
   */
  getRecommendQuestion(params){
    let url = '/robot/recommend/question';
    return this.http.getJson(url,params);
  }

  /**
   * 根据URL地址取免责声明内容
   * @param filePath
   * @returns {*}
   */
  getDisclaimer(filePath) {
    return this.http.get(filePath);
  }

  /**
   * 获取HTML文件内容
   * @param filePath
   * @returns {*}
   */
  getHtml(filePath) {
    return this.http.getHtml(filePath);
  }

  /**
   * 获取XML文件内容
   * @param filePath
   * @returns {*}
   */
  getXML(filePath) {
    return this.http.getXML(filePath);
  }

  /**
   * 同行数据对比
   * @param params
   * @returns {Promise}
   */
  getFinanceInduCompare (params) {
    let url = '/financeAnalysis/financeInduCompare';
    return this.http.getJson(url, params);
  }

  /**
   * 财务数据
   * @param params
   * @returns {Promise}
   */
  getFinanceReport (params) {
    let url = '/financeAnalysis/financeReport';
    return this.http.getJson(url, params);
  }
}

export default {
  SemanticApiService: SemanticApiService,
}
