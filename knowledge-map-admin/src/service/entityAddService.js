/**
 * Created by lijian on 2018/5/3.
 */
class entityAddService{
  constructor(clientAxios){
    this.http = clientAxios;
  }
  //获取动态实体关系列表
  getEntityTypeList(params){
    let url = '/dict/type/tree';
    return this.http.getJson(url,params);
  }
  //实体类型-添加新类型
  addEntityType(params){
    let url = '/dict/type';
    return this.http.post(url,params);
  }
  //NER知识-全部实体类型
  allEntityType(params){
    let url = '/dict/type';
    return this.http.getJson(url,params);
  }
  //ner后台---搜索
  getNerDateList(params){
    let url = '/ner/search';
    return this.http.getJson(url,params);
  }
  //ner后台---编辑
  getNerEditDateList(params){
    let url = '/ner/update';
    return this.http.post(url,params);
  }
  //ner后台---数据来源
  getSourceList(params){
    let url = '/ner/source';
    return this.http.getJson(url,params);
  }
  //ner后台---数据来源,知识来源
  getAllSourceList(params){
    let url = '/knowledge/filed/facet';
    return this.http.getJson(url,params);
  }
  //ner后台---实体词典绑定
  getNerXscBd(params){
    let url = '/dict/add/synonym';
    return this.http.getJson(url,params);
  }
  //知识点查询接口
  getknowledgeList(params){
    let url = '/knowledge/search';
    return this.http.getJson(url,params);
  }
  //对象知识-搜索
  getObjSearchList(params){
    let url = '/knowledge/search';
    return this.http.getJson(url,params);
  }
  //对象知识-添加
  getAddObjList(params){
    let url = '/knowledge';
    return this.http.postJson(url,params);
  }
  //对象知识-采纳
  getObjAdoptData(params){
    let url = '/knowledge/candidate';
    return this.http.postJson(url,params);
  }
  //对象知识-知识点获取
  getAddObjZsdData(params){
    let url = '/knowledge/candidate/search';
    return this.http.getJson(url,params);
  }
  //词典-列表
  getDictList(params){
    let url = '/dict';
    return this.http.get(url,params);
  }
  //词典-修改
  getCdEditData(params){
    let url = '/dict';
    return this.http.postJson(url,params);
  }
  //词典-删除
  getDeleteCdEditData(params){
    let url = '/dict';
    return this.http.delete(url,params);
  }
  //词典-添加前词性校验
  getdictAddCxReplate(params){
    let url = '/dict/type/verify';
    return this.http.get(url,params);
  }
}

export default{
  entityAddService
}
