import React from 'react';
import connect from '@utils/translateConnect';
import { Form, DatePicker, Button } from 'antd';
import moment from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD'
const now = moment().subtract('days', 1)

class DateRange extends React.Component {
  static defaultProps = {
    defaultValue: [moment(now).subtract('days', 6), moment(now)],
    format: DATE_FORMAT,
    needCheck: false
  }

  state = {
    value: this.props.defaultValue
  }

  selectedDate = null

  disabledDate = (current) => {
    if (this.selectedDate) {
      const minDate = moment(this.selectedDate).subtract('days', 30)
      const maxDate = moment(this.selectedDate).add('days', 30)

      return current && current > moment(now).endOf('day') || current.isAfter(maxDate) || current.isBefore(minDate)
    }

    return current && current > moment(now).endOf('day');
  }

  handleValueChange = (value) => {
    this.setState({
      value
    })
  }

  handlePanelChange = (value) => {
    this.selectedDate = value[0]
  }

  render() {
    const { t, isBpmApp, needCheck } = this.props
    const { value } = this.state

    return (
      <div className="manage-dashboard-daterange">
        <Form layout="inline">
          <Form.Item label={t('统计时间')}>
            <DatePicker.RangePicker
                value={value}
                disabledDate={this.disabledDate}
                ranges={{
                  '近一周': [moment(now).subtract('days', 6), moment(now)],
                  '近一月': [moment(now).subtract('days', 30), moment(now)],
                }}
                showTime={false}
                allowClear={false}
                onChange={this.handleValueChange}
                onCalendarChange={this.handlePanelChange}
                disabled={needCheck && !isBpmApp}
                format={this.format}
              />
          </Form.Item>
          <Form.Item>
            <Button type="primary" disabled={needCheck && !isBpmApp} onClick={() => { this.props.onSearch(value.map(item => item.format(this.props.format)))}}>{t('查询')}</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default connect(({ global }) => ({
  isBpmApp: global.isBpmApp
}))(DateRange)
