/**
 *  @author hhx
 *  @date 2020-07-01 11:38
 */
import moment from 'moment'

function getLastWeekDates() {
  let lastDay = moment().subtract(1, 'days')
  let lastWeekDay = moment().subtract(7, 'days')
  return [lastWeekDay, lastDay]
}

export {getLastWeekDates}
