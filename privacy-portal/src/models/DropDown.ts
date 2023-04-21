import { action } from 'mobx'
import { questionCategorySelector, appSelector } from '../services/dropDown'

// export interface ICarouse {

// }
export interface IDropDownModel {
  questionCategorySelector(params?: any)
  appSelector(params?: any)

}

export default class DropDown implements IDropDownModel {

  @action
  async questionCategorySelector(params?: any) {
    const { data } = await questionCategorySelector(params)
    // console.dir(data)
    return data
  }

  async appSelector(params?: any) {
    const { data } = await appSelector(params)
    // console.dir(data)
    return data
  }
}
