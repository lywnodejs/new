/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class freeQuestionService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * 事件列表
   * @returns {Promise}
   */
  freeQuestion (params) {
    let url = '/api/freeQuestion'
    return this.http.getJson(url, params)
  };
}
export default {
  freeQuestionService,
}
