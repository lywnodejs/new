/**
 *  @author hhx
 *  @date 2020-05-14 16:33
 */
import {REPAY_TYPE} from './const'

export const getRepayType = (v) => {
  let item = REPAY_TYPE.find((i) => i.value == v)
  return (item && item.name) || ''
}
