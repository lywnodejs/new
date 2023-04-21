/**
 * Created by lijian on 2018/5/3.
 */
class spriteKeyService{
  constructor(clientAxios){
    this.http = clientAxios;
  }
  //实体名称
  getEntityNameList(params){
    let url = '/key/wizard/general';
    return this.http.getJson(url,params);
  }
  //实体名称new
  getEntityNameListNew(params){
    let url = '/key/wizard/general';
    return this.http.getJson(url,params);
  }
}

export default{
  spriteKeyService
}
