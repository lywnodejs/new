import { DATE_TIME_FORMAT } from 'commons/constant'
import moment from 'moment'

export default {
  methods: {
    fmtTableLongTime(row, column, cellValue, index) {
      if (cellValue) {
        return moment(cellValue).format(DATE_TIME_FORMAT)
      }
      return ''
    },

    fmtLongTime(value) {
      if (value) {
        return moment(value).format(DATE_TIME_FORMAT)
      }
      return ''
    }
  }
}
