/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class NodeService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * get quota list
   * @returns {Promise}
   */
  getTemplate (params) {
    let url = '/api/template'
    return this.http.getJson(url, params)
  }


}
export default {
  NodeService,
}
