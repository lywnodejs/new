/*
 * @Date: 2020-11-02 15:02:18
 * @Author: 刘亚伟
 * @LastEditTime: 2020-11-11 17:45:44
 */
import { RouterStore } from 'mobx-react-router'
import { IApp } from '../models/App'
import { IHomeModel } from '../models/Home'


export interface IBase {
  router?: RouterStore
  app?: IApp
}

export interface IHomePage extends IBase {
  home?: IHomeModel
}

