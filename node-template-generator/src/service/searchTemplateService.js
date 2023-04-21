/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class SearchTemplateService {
    constructor(clientAxios) {
        this.http = clientAxios
    }

    getTemplateSearch(params){
        let url = '/api/template';
        return this.http.getJson(url, params);
    }
    
    // 股票指数对比
    getContrastStockData (params) {
      let url = '/api/dataStation/template';
      return this.http.getJson(url, params);
    }
}

export default {
    SearchTemplateService: SearchTemplateService,
}
