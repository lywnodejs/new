/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class StockAnalysisService {
  constructor(clientAxios) {
    this.http = clientAxios
  }

  fixApi(params){
    let url = '/api/qa/fix';
    params.recordLog =  false;
    return this.http.getJson(url,params);
  }


  apiStockAreaPrice(params){

    let url = '/stock/area/priceAnalysis/'+params.val+"/"+params.symbol+"?dayNum=150&min=60"
    return this.http.getJson(url,"");
  }

  getKLineData(params){

    let url = '/technichal/analysis/'+params.cycle+'/'+params.type+'/'+params.val+'/'+params.symbol+'?cache=true'
    return this.http.getJson(url,"");
  }


  getKLineData_area(params){

    let url = '/trend/analysis/'+params.val+'/'+params.symbol
    return this.http.getJson(url,"");
  }

  // 取财务分析指标
  getPartInfos (params) {
    return this.http.getJson('/financeAnalysis/partInfos', params)
  }
}

export default {
  StockAnalysisService: StockAnalysisService,
}
