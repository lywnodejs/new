/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class marketPredictionService {
  constructor(clientAxios) {
    this.http = clientAxios
  }

  getlist(params){
    let url = '/analysis'
    return this.http.getJson(url,params);
  }

  getycDate(params){
    let url = '/predict'
    return this.http.getJson(url,params);
  }


}

export default {
  marketPredictionService: marketPredictionService,
}
