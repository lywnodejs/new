/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class YysbServiceList {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * 事件列表
   * @returns {Promise}
   */

  getList (params) {
    let url = `/intelligent/report`
    return this.http.postJson(url, params)
  };
}
export default {
  YysbServiceList,
}
