import { action } from 'mobx'
import { displayedApps } from '../services/displayedApps'

// export interface ICarouse {

// }
export interface IDisplayedAppsModel {
  displayedApps(params?: any)
}

export default class DisplayedApps implements IDisplayedAppsModel {

  @action
  async displayedApps(params?: any) {
    const { data } = await displayedApps(params)
    // console.dir(data)
    return data
  }
}
