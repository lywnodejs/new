/**
 * Created by zhaobo on 18/07/25.
 */
/* eslint-disable */
class ShareServer {
    constructor (clientAxios) {
      this.http = clientAxios
    }
  
    /**
     * get quota list
     * @returns {Promise}
     */
    share (params) {
      let url = '/activity/sign.do'
      return this.http.getJson(url, params)
    }
  }
  export default {
    ShareServer,
  }
  