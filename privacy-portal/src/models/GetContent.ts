import { action } from 'mobx'
import { getContent } from '../services/getContent'

// export interface ICarouse {

// }
export interface IGetContentModel {
  getContent(params?: any)
}

export default class GetContent implements IGetContentModel {

  @action
  async getContent(params?: any) {
    const { data } = await getContent(params)
    // console.dir(data)
    return data
  }
}
