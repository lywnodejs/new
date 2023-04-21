/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class infoEventService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  getEvent (params) {
    let url = '/infoEvent'
    return this.http.getJson(url, params)
  };

  getCommonSelect (params) {
    let url = '/bigSearch'
    return this.http.getJson(url, params)
  };
  /**
   * 政策详情
   */
  getZXCXdetail (id) {
    let url = '/information/detail/'+id
    return this.http.getJson(url)
  };
  getHome (params) {
    let url = '/page/question/new'
    return this.http.getJson(url,params)
  };
  /**
   * 键盘精灵接口
   * @param params 包含三个参数：
   * type：股票：100，指数：101，行业：1，申万行业：sw
   * query：搜索文本
   * count：返回数量
   * @returns {Promise}
   */
  searchStock (params) {
    let url = '/key/wizard'
    return this.http.getJson(url, params)
  }
}
export default {
  infoEventService,
}
