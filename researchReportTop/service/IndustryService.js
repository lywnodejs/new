/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class IndustryService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * 事件列表
   * @returns {Promise}
   */

  getreport (params) {
    let url = `/report/info`
    return this.http.getJson(url, params)
  };
}
export default {
  IndustryService,
}
