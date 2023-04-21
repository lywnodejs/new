/*
 * @Date: 2018-12-29 15:34:34
 * @Author: 刘亚伟
 * @LastEditTime: 2018-12-29 15:40:09
 */

/* eslint-disable */
class infoService {
  constructor (clientAxios) {
    this.http = clientAxios
  }

  /**
   * 事件列表
   * @returns {Promise}
   */
  
  infoID(id){
    let url = `/information/detail/${id}`
    return this.http.getJson(url)
  }
}
export default {
  infoService,
}
