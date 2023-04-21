/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class TestService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * 事件列表
   * @returns {Promise}
   */
  gettemplate (params) {
    let url = '/api/template'
    return this.http.getJson(url, params)
  };

  /**
   * 预览模块用post，因参数过多无法传递
   * @param params
   * @returns {Promise}
   */
  getNodeTemplatePost (params) {
    let url = '/api/dataStation/template'
    return this.http.postJson(url, params)
  }
}
export default {
  TestService,
}
