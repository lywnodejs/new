/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class MetadataDimDwService {
    constructor(clientAxios) {
        this.http = clientAxios
    }

    getDailyIndicatorBySymbol(params){
      let url = '/industry/stock/indicator/limit/';
      return this.http.getJson(url,params);
    }
}

export default {
    MetadataDimDwService: MetadataDimDwService,
}
