import { observable, action, runInAction } from 'mobx'

import { getExampleList } from '../services/example'

// 定义存储数据类型
export interface IExample {
  exampleList: any
  getExampleList(params: any)
}

export default class Example implements IExample {

  @observable exampleList: any

  constructor() {
    this.exampleList = {}
  }

  @action
  async getExampleList(params: any) {
    const ResponseObject = await getExampleList(params)

    runInAction(() => {
      this.exampleList = ResponseObject.data
    })
  }
}
