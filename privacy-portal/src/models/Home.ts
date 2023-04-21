import { observable, action, runInAction } from 'mobx'
import { getList } from '../services/home'

export interface IHomeModel {
  list: any
  getList()
}

export default class Home implements IHomeModel {
  @observable list: any
  constructor() {
    this.list = {
      pictures: [{
      }],
      notice: [{}, {}, {}, {}],
      honors: [],
      gifts: []
    }
  }

  @action
  async getList() {
    const { data } = await getList()
    runInAction(() => {
      this.list = data
    })
  }
}
