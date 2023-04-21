/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class LogService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * get quota list
   * @returns {Promise}
   */
  save (params) {
    let url = '/save'
    return this.http.postJson(url, params)
  }


}
export default {
  LogService,
}
