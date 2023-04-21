/**
 * Created by zhaobo on 19/10/23.
 */

/**
 * 投教服务
 */
class EduService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * 取科创板投教知识
   * @returns {Promise}
   */
  getEduArticles () {
    let url = '/edu/listUrl/article';
    let params = {
      productId: 'CP170317001',
      client: 'web',
      cp: 1,
      ps: 50,
      navigationTypeIds: 1072,
      showDetail: false
    };
    return this.http.getJson(url, params)
  }
}

export default {
  EduService
}
