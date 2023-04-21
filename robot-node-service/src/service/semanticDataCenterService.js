/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class SemanticDataCenterService {
  constructor(clientAxios) {
    this.http = clientAxios
  }

  apiNotice(params){
    let url = '/company/notice/' + params.market + "/" + params.stockcode;
    return this.http.getJson(url,params);
  }

}

export default {
  SemanticDataCenterService: SemanticDataCenterService,
}
