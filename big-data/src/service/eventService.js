/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class EventService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * 事件列表
   * @returns {Promise}
   */
  getEventList (params) {
    let url = '/api/template'
    return this.http.getJson(url, params)
  };

  /**
   * 资讯列表
   * @returns {Promise}
   */
  getInfomationMes (params) {
    let url = '/api/template'
    return this.http.getJson(url, params)
  };

  /**
   * 资讯列表
   * @returns {Promise}
   */
  getindustryChain(params) {
    let url = '/api/template'
    return this.http.getJson(url, params)
  };
}
export default {
  EventService,
}
