import moment from 'moment'
import {DATE_FORMAT, DATE_TIME_FORMAT} from 'commons/constant'

const date = {}

date.format2Date = format2Date
date.format2Time = format2Time

function format2Date(timeStamp) {
  return moment(timeStamp).format(DATE_FORMAT)
}

function format2Time(timeStamp) {
  return moment(timeStamp).format(DATE_TIME_FORMAT)
}

export {
  date,
  format2Date,
  format2Time
}
