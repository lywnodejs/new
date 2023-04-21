/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class StockAnalysisService {
  constructor(clientAxios) {
    this.http = clientAxios
  }


  apiStockAreaPrice(params){

    let url = '/stock/area/priceAnalysis/'+params.val+"/"+params.symbol+"?dayNum=150&min=60"
    return this.http.getJson(url,"");
  }

  getKLineData(params){

    let url = '/technichal/analysis/'+params.val+'/'+params.symbol
    return this.http.getJson(url,"");
  }
  getKLineData_area(params){

    let url = '/trend/analysis/'+params.val+'/'+params.symbol
    return this.http.getJson(url,"");
  }
}

export default {
  StockAnalysisService: StockAnalysisService,
}
