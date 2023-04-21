/*
 * @Date: 2020-11-02 15:02:18
 * @Author: 刘亚伟
 * @LastEditTime: 2020-11-17 11:43:25
 */
import App from '../models/App'
import HomeModel from '../models/Home'

export interface IStore { }

export default {
  app: new App(),
  home: new HomeModel(),
}
