import { observable, action, runInAction } from 'mobx'
import { indexxmg } from '../services/consec'

export interface IHomeModel {
  list: any
  getIndexxmg()
}

export default class Home implements IHomeModel {
  @observable list = []

  @action
  async getIndexxmg() {
    const { data } = await indexxmg()
    runInAction(() => {
      this.list = data
    })
  }
}
