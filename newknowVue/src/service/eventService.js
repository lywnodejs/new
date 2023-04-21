/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class EventService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * 首页顶部数据
   * @param params
   * @returns {Promise}
   */
  getIncludeList (params) {
    let url = '/kb/statistics/aggregation'
    return this.http.getJson(url, params)
  };

  /**
   * 输入框信息
   * @param params
   * @returns {Promise}
   */
  getInput (params) {
    let url = '/kg/key/wizard'
    return this.http.getJson(url, params)
  };

  /**
   * 首页球体数据
   * @param params
   * @returns {Promise}
   */
  getBall (params) {
    let url = '/kg/hot/word'
    return this.http.getJson(url, params)
  };
}
export default {
  EventService,
}
