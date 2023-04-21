/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class InfoApiService {
  constructor(clientAxios) {
    this.http = clientAxios
  }

  apiReportDetail(params){
    let url = '/report/detail.do';
    return this.http.getJson(url,params);
  }

  apiNewsDetail(params){
    let url = '/news/detail.do';
    return this.http.getJson(url,params);
  }

  apiAdvancedNewsDetail(params){
    let url = '/news/advancedSearch.do';
    return this.http.getJson(url,params);
  }

}

export default {
  InfoApiService: InfoApiService,
}
