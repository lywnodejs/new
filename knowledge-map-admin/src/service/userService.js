/**
 * Created by lijian on 2018/5/3.
 */
/**
 * @description 用户相关接口
 * @param {Object}
 * @constructor
 */
class UserService{
  constructor(clientAxios){
    this.http=clientAxios
  }
  login(params){
    let url='/user/signin';
    return this.http.postJson(url,params)
  }

}
export default{
  UserService
}
