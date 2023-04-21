import { action, observable} from 'mobx'
import { getCarouselList } from '../services/carousel'

// export interface ICarouse {

// }
export interface ICarouselModel {
  carouselList: any
  getCarouselList()
}

export default class Carousel implements ICarouselModel {
  @observable carouselList: any
  // @observable imgUrl: any

  // constructor() {
  //   this.carouselList = []
  // }

  @action
  async getCarouselList() {
    const { data } = await getCarouselList()
    // console.dir(data)
    return data
    
    // runInAction(() => {
    //   this.carouselList = [...data] // data是一个数组 [{id:1},{id:2}]
    // })
  }
}
