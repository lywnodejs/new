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

  apiQaQuestion(params){
    let url = '/api/qa/fix'
    params.recordLog =  false;
    return this.http.getJson(url,params);
  }

  apiFinanceAnalysis(params){
    let url = '/financeAnalysis/financeReport'
    params.recordLog =  false;
    return this.http.getJson(url,params);
  }

  apiSignalSearch(params){
    let url = '/semantic/content/search';
    params.recordLog =  false;
    return this.http.getJson(url,params);
  }

  apiKnowMap(params){
    let url = '/kb/statistics/query'
    return this.http.getJson(url,params);
  }
  know(params){
    let url = '/kg/search';
    return this.http.getJson(url,params);
  }

  clientKnow(params){
    let url = '/kg/client/search';
    return this.http.getJson(url,params);
  }

    knowType(params){
        let url = '/kb/INTRO/search';
        return this.http.getJson(url,params);
    }

  getinforamtionEvent(params){
    let url = '/infoEvent';
    return this.http.getJson(url,params);
  }

  getinforamtionEventRelated(params){
    let url = '/infoEvent/infos';
    return this.http.getJson(url,params);
  }



  apiPolicyQuestion(params){
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

  // 取财务分析指标
  getPartInfos (params) {
    return this.http.getJson('/financeAnalysis/partInfos', params)
  }

  // 资讯列表
  getInfomationMes(params) {
      return this.http.getJson('/bigSearch', params)
  }
  //研报搜索、风险提示
  getRiskNotice(params) {
      return this.http.getJson('/kb/RISK_PROMPT/searchStock', params)
  }
  //定期报告内容搜索
  getPeriodicReport(type,params) {
    return this.http.getJson('/kb/'+ type +'/searchStock', params)
  }
  policySearch(params) {
      return this.http.getJson('/policy/search', params)
  }
  home(params) {
    return this.http.getJson('/policy/search/homePage/', params)
  }
  infinity(params) {
    return this.http.getJson('/policy/search/', params)
  }

  // 财务数据
  getFinanceReport (params) {
    let url = '/financeAnalysis/financeReport';
    return this.http.getJson(url, params);
  }

  robotStock(params) {
    let url = '/datacenter/fundFace/stockPledge';
    return this.http.getJson(url, params);
  }
    
  // 市场预测数据
  marketPredictionData (params) {
    let url = '/analysis';
    return this.http.getJson(url, params);
  }

}

export default {
  SemanticApiService: SemanticApiService,
}
