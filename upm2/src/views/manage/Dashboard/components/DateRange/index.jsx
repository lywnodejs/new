import React from 'react';
import connect from '@utils/translateConnect';
import { Form, DatePicker, Button, Radio } from 'antd';
import moment from 'moment'

const FormItem = Form.Item;
const DATE_FORMAT = 'YYYY-MM-DD'
const now = moment().subtract('days', 1)

class DateRange extends React.Component {
  static defaultProps = {
    defaultValue: [moment(now).subtract('days', 6), moment(now)],
    format: DATE_FORMAT,
    needCheck: false
  }

  state = {
    value: this.props.defaultValue,
    time: 7
  }

  selectedDate = null

  disabledDate = (current) => {
    if (this.selectedDate) {
      const minDate = moment(this.selectedDate).subtract('days', 365)
      const maxDate = moment(this.selectedDate).add('days', 365)

      return current && current > moment(now).endOf('day') || current.isAfter(maxDate) || current.isBefore(minDate)
    }

    return current && current > moment(now).endOf('day');
  }

  handleValueChange = (value) => {
    this.setState({
      value
    }, () => {
      this.onSearch();
    })
  }

  handlePanelChange = (value) => {
    this.selectedDate = value[0]
  }

  onZhouqiChange = (time) => {
    this.setState({time}, () => {
      this.onSearch();
    })
  }

  onSearch = () => {
    let { value, time } = this.state
    if (time == 7) {
      value = [moment(now).subtract('days', 6), moment(now)];
    } else if (time == 30) {
      value = [moment(now).subtract('days', 30), moment(now)];
    }
    this.props.onSearch(value.map(item => item.format(this.props.format)))
  }

  render() {
    const { t, isBpmApp, needCheck } = this.props
    const { value, time } = this.state
    return (
      <div className="manage-dashboard-daterange">
        <Form layout="inline">
          <FormItem
            label={t('周期')}
          >
            <Radio.Group
              name="radiogroup"
              value={this.state.time}
              onChange={e => this.onZhouqiChange(e.target.value)}
            >
              <Radio value={7}>7{t('天')}</Radio>
              <Radio value={30}>30{t('天')}</Radio>
              <Radio value={-1}>{t('自定义')}</Radio>
            </Radio.Group>
          </FormItem>
          <Form.Item>
            <DatePicker.RangePicker
                value={value}
                style={{width: 220}}
                disabledDate={this.disabledDate}
                // ranges={{
                //   '近一周': [moment(now).subtract('days', 6), moment(now)],
                //   '近一月': [moment(now).subtract('days', 30), moment(now)],
                // }}
                showTime={false}
                allowClear={false}
                onChange={this.handleValueChange}
                onCalendarChange={this.handlePanelChange}
                disabled={this.state.time!==-1 || (needCheck && !isBpmApp)}
                format={this.format}
              />
          </Form.Item>
          {/* <Form.Item>
            <Button type="primary" disabled={needCheck && !isBpmApp} onClick={this.onSearch}>{t('查询')}</Button>
          </Form.Item> */}
        </Form>
      </div>
    )
  }
}

export default connect(({ global }) => ({
  isBpmApp: global.isBpmApp
}))(DateRange)
