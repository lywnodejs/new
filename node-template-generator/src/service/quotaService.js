/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class QuotaService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * get quota list
   * @returns {Promise}
   */
  getQuota (params) {
    let url = '/json/getMultiPrice'
    return this.http.getJson(url, params)
  }

  /**
   * get quota list
   * @returns {Promise}
   */
  getkline (params) {
    let url = '/json/getKline'
    return this.http.getJson(url, params)
  }

  /**
   * get symbol
   * @returns {Promise}
   */
  getSymbolPrice (params) {
    let url = '/json/getPrice'
    return this.http.getJson(url, params)
  }

}
export default {
  QuotaService,
}
