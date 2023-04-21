/**
 * Created by lijian on 2018/5/3.
 */
/**
 * @description 用户相关接口
 * @param {Object}
 * @constructor
 */
class maintainHotServeice{
  constructor(clientAxios){
    this.http=clientAxios
  }
  getHotList(params){
    let url = '/info/hotConceptGet';
    return this.http.getJson(url,params);
  }
  updateHot(params){
    let url='/info/update/intro';
    return this.http.post(url,params);
  }

}
export default{
  maintainHotServeice
}
