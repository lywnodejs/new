import {DatePicker} from 'antd'
import moment from 'moment'

const DateSelect = (props) => {
  const disabledDate = (current) => {
    return current && current >= moment().endOf('day')
  }
  return (
    <DatePicker.RangePicker
      {...props}
      disabledDate={disabledDate}
      allowClear={false}
    />
  )
}

export default DateSelect
