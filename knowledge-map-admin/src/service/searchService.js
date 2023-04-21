/**
 * Created by lijian on 2018/4/27.
 */
/**
 * @description 搜索相关接口
 * @param {Object}
 * @constructor
 */
class SearchService{
  constructor(clientAxios){
    this.http = clientAxios;
  }


  /**
   * GET /synonym/type/search
   实体类型列表查询
   */
  getLeftList(params){
    let url = '/synonym/type/search';
    return this.http.getJson(url,params)
  }

  //添加同义词
  addSynonymServer(params){
    let url = `/synonym/type/baseName/add`;
    // let url = `/synonym/${params.type}/${base}/add`;
    return this.http.put(url,params)
  }
  //删除同义词  DELETE /synonym/delete/synonym/{id}
  deteleSynonym(params){
    let url = '/synonym/delete/synonym/'+params.id;
    return this.http.delete(url)
  }

  //删除基词  /synonym/delete/{baseWordId}
  deleteImportant(params){
    let url = '/synonym/delete/'+params.baseWordId;
    return this.http.delete(url)
  }

  /**
   * 获取账号详情
   */
  getSearch(params){
    let url = `/synonym/${params.type}/search`;
    return this.http.getJson(url,params)
  }
    //设置为基词 /synonym/update/base
  setSynonym(params){
    let url = '/synonym/update/base';
    return this.http.postJson(url,params)
  }
  /**
   * GET /synonym/nature/words
   根据实体查询基词同义词
   */
  searchSynonym (params){
    let url = `/synonym/nature/words/`;
    return this.http.getJson(url,params)
  }
  //股票键盘精灵
  promptStock(params){
    let url='/prompt/stock/search';
    return this.http.getJson(url,params)
  }
//股票键盘精灵
  promptIndustryOrproduct(params){
    let url='/prompt/industryOrproduct/search';
    return this.http.getJson(url,params)
  }


  //移除白名单
  delWhiteList(params){
    let url = `/synonym/update/delWhiteList`;
    return this.http.put(url,params)
  }
  //加入白名单
  addWhiteList(params){
    let url = `/synonym/update/whiteList`;
    return this.http.put(url,params)
  }

}



export default {
  SearchService
};
