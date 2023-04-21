/**
 * Created by lijian on 2018/5/3.
 */
class EntityService{
  constructor(clientAxios){
    this.http = clientAxios;
  }
  //获取动态实体关系列表
  getKnowledgeList(params){
    let url = '/knowledge/temp/search';
    return this.http.getJson(url,params);
  }

  //获取实体关系列表
  getKnowledgeTypeList(params){
    let url = '/knowledge/search';
    return this.http.getJson(url,params);
  }
  //黑名单列表
  getBlackList(params){
    let url = '/blacklist/search';
    return this.http.getJson(url,params);
  }
  //白名单列表
  getWhiteList(params){
    let url = '/whitelist/search';
    return this.http.getJson(url,params);
  }
  //实体关系联动
  getRealtion(params){
    let url=`/knowledge/${params.entityLeftType}/${params.entityRightType}`;
    return this.http.getJson(url);
  }

  //删除实体关系
  deleteSingleRealtion(params){
    let url=`/knowledge/${params.indexId}`;
    return this.http.delete(url,{'entityRight':params.entityRight});
  }

  //编辑实体关系
  editSingleRealtion(params){
    let url=`/knowledge/${params.indexId}`;
    return this.http.put(url,{'text':params.text});
  }

  //加入黑名单
  addSingleBlackList(params){
    let url='/knowledge/blacklist';
    return this.http.postJson(url,params);
  }
  //移除黑名单
  moveOutBlackList(params){
    let url=`/blacklist/${params.id}`;
    return this.http.delete(url);
  }
  //增加实体关系
  addKnowledgeType(params){
    let url = '/knowledge/addKnowledge';
    return this.http.postJson(url,params);
  }
}

export default{
  EntityService
}
