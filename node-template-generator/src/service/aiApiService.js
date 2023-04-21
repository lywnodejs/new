/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class AiApiService {
  constructor(clientAxios) {
    this.http = clientAxios
  }

  getknowledge(params){
    let url = '/index/knowledge'
    return this.http.getJson(url,params);
  }


}

export default {
  AiApiService: AiApiService,
}
