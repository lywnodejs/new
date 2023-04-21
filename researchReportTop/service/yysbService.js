/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class YysbService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * 事件列表
   * @returns {Promise}
   */

  getInfoList (params) {
    let url = `/intelligent/report`
    return this.http.postJson(url, params)
  };
}
export default {
  YysbService,
}
