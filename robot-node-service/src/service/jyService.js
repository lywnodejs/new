/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class JyService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * get quota list
   * @returns {Promise}
   */
  getLastKData (params) {
    let url = '/json/getReport.do'
    return this.http.getJson(url, params)
  }


}
export default {
  JyService,
}
