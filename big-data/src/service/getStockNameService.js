/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class getStockNameService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * 事件列表
   * @returns {Promise}
   */
  getStockName (params) {
    let url = '/json/getMultiPrice'
    return this.http.getJson(url, params)
  };
}
export default {
  getStockNameService,
}
