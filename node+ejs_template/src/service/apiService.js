/**
 * Created by zhaobo on 18/07/25.
 */

/* eslint-disable */
class ApiService {
  constructor(clientAxios) {
    this.http = clientAxios
  }

  getRundownData(id){
    let url = `/admin/api/event/${id}/extension?fields=rundown`
    return this.http.getJson(url);
  }


}

export default {
  ApiService: ApiService,
}
