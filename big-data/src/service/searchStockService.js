/**
 * Created by xdy on 2020/09/18.
 */
/* eslint-disable */
class SearchStockService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

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
  SearchStockService,
}
