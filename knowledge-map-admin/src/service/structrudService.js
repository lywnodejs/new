/**
 * Created by wxz on 2019/12/11.
 */
/**
 * @description 结构化相关接口
 * @param {Object}
 * @constructor
 */
class structrudService{
  constructor(clientAxios){
    this.http=clientAxios
  }
  getList(params){
    let url = '/knowledge/structured/api/web/find';
    return this.http.getJson(url,params);
  }
  //添加多条知识点
  addMore(params){
    let url = '/knowledge/structured/api/web/bulkInsert';
    return this.http.postJson(url,params);
  }
  //编辑
  editMore(params){
    let url = '/knowledge/structured/api/web/updateOne';
    return this.http.postJson(url,params);
  }
  //审核
  examineWay(params){
    let url = '/knowledge/structured/api/web/setPass';
    return this.http.postJson(url,params);
  }
  //删除
  deleteApiWay(params){
    let url = '/knowledge/structured/api/web/setValid';
    return this.http.postJson(url,params);
  }
  //结构化知识-数据来源、实体类型
  getSourceEntityData(params){
    let url = '/knowledge/structured/api/web/group';
    return this.http.getJson(url,params);
  }
  //获取实体自有属性
  getSchema(params){
    let url = '/attribute/schema';
    return this.http.getJson(url,params);
  }

}
export default{
  structrudService
}
