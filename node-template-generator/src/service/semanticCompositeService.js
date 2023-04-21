/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class SemanticCompositeService {
  constructor(clientAxios) {
    this.http = clientAxios
  }

  getStockType(params){
    let url = '/stock/' + params.subjectMarket  + "/" + params.subjectCode;
    console.log(url)
    return this.http.getJson(url,params);
  }
  getStockDetail(params){//司法纠纷详情页
    let url = '/legal/detail/byCaseNumber';
    return this.http.getJson(url,params);
  }
}

export default {
  SemanticCompositeService: SemanticCompositeService,
}
