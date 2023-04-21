import { action } from 'mobx'
import { feedback } from '../services/feedback'

// export interface ICarouse {

// }
export interface IFeedbackModel {
  feedback(params: any)
}

export default class Feedback implements IFeedbackModel {

  @action
  async feedback(params: any) {
    const { data } = await feedback(params)
    // const P = new Promise((res,rej) => {})
    // P.abort = () => {}
    return data
  }
}
