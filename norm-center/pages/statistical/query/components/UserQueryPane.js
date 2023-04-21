import {Button, DatePicker, Form, Input, Select, Table} from 'antd'
import React, {useEffect, useState} from 'react'
import moment from 'moment'
import columns from '~/components/model/ColumnsModel'
import Router, {withRouter} from 'next/router'
import fetch from '~/utils/fetch'
import styles from '../style.less'

const {RangePicker} = DatePicker

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = {}) => {
  const {
    data: {data, code},
  } = await fetch(
    'fincloud.basics.indicators.center.api.datasource.indicatorsstatisticservice.searchcalldata',
    [{...params, ...pageParams}],
  )

  console.log('params', params)

  if (code == 0) {
    console.log('data', data)
    return data
  }
  return {totalSize: 0, list: []}
}

function UserQueryPane() {
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState({totalSize: 0, list: []})

  // date
  const [dates, setDates] = useState([])
  const [hackValue, setHackValue] = useState()
  const [value, setValue] = useState()
  const [indexGroup, setIndexGroup] = useState([])

  const onReset = () => {
    form.resetFields()
  }

  const indexType = [
    {indicatorsType: 'base', indicatorsTypeName: '基础指标'},
    {indicatorsType: 'derivation', indicatorsTypeName: '衍生指标'},
  ]

  const updateList = async (params = {}) => {
    let data = await getData(params)
    if (data.list) {
      data.list.forEach((item) => {
        item.callDate = moment(item.callDate).format('YYYY-MM-DD')
      })
    }
    setDataSource(data)
  }

  useEffect(() => {
    const last7 = moment().subtract(6, 'days').format('YYYY-MM-DD')
    const today = moment().format('YYYY-MM-DD')
    updateList({startDate: last7, endDate: today})
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await fetch(
          'fincloud.basics.indicators.center.api.datasource.indicatorsmanageservice.getgroups',
          [{}],
        )

        if (code === 0) {
          setIndexGroup(data)
          return
        }

        setIndexGroup([])
      } catch (err) {
        setIndexGroup([])
      }
    }
    fetchData()
  }, [])

  // date
  const disabledDate = (current) => {
    if (!dates || dates.length === 0) {
      return false
    }
    const tooLate = dates[0] && current.diff(dates[0], 'days') > 6
    const tooEarly = dates[1] && dates[1].diff(current, 'days') > 6
    return tooEarly || tooLate
  }

  const onOpenChange = (open) => {
    if (open) {
      console.log('inter')
      setHackValue([])
      setDates([])
      form.setFieldsValue({
        time: [],
      })
    } else {
      setHackValue(undefined)
    }
  }

  // * -------------------------------------------------------

  const onFinish = (values) => {
    let {time, ...params} = form.getFieldsValue()
    if (time && time.length !== 0) {
      params.startDate = moment(time[0]).format('YYYY-MM-DD')
      params.endDate = moment(time[1]).format('YYYY-MM-DD')
    }
    Object.keys(params).forEach(function (key) {
      if (!params[key]) {
        delete params[key]
      }
    })
    pageParams.pageNo = 1
    updateList(params)
  }

  const onChange = (current, pageSize) => {
    console.log('onChange:', current, pageSize)
    let {time, ...params} = form.getFieldsValue()
    if (!!time) {
      params.startDate = moment(time[0]).format('YYYY-MM-DD')
      params.endDate = moment(time[1]).format('YYYY-MM-DD')
    }
    Object.keys(params).forEach(function (key) {
      if (!params[key]) {
        delete params[key]
      }
    })
    pageParams.pageSize = pageSize
    pageParams.pageNo = current
    updateList(params)
  }
  const pagination = {
    defaultCurrent: 1,
    total: dataSource.totalSize,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: onChange,
  }

  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
        layout="inline"
        initialValues={{time: [moment().subtract(6, 'day'), moment()]}}
      >
        <Form.Item name="mobilephone" label="手机号">
          <Input placeholder="请输入用户手机号" />
        </Form.Item>
        <Form.Item name="idcard" label="身份证号">
          <Input placeholder="请输入用户身份证号" />
        </Form.Item>
        <Form.Item label="指标类型" name="indicatorsType">
          <Select style={{width: 240}} placeholder="请选择">
            {indexType.map((v) => {
              return (
                <Select.Option value={v.indicatorsType} key={v.indicatorsType}>
                  {v.indicatorsTypeName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item label="分组名" name="groupId">
          <Select style={{width: 240}} placeholder="请选择">
            {indexGroup.map((v) => {
              return (
                <Select.Option value={v.groupId} key={v.groupId}>
                  {v.groupName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item name="indicatorsNameCn" label="指标中文名">
          <Input />
        </Form.Item>
        <Form.Item name="result" label="命中结果">
          <Input />
        </Form.Item>
        <Form.Item label="调用日期" name="time" rules={[{required: true}]}>
          <RangePicker
            value={hackValue || value}
            disabledDate={disabledDate}
            onCalendarChange={(val) => setDates(val)}
            onChange={(val) => setValue(val)}
            onOpenChange={onOpenChange}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{marginRight: 15}} htmlType="submit">
            查 询
          </Button>
          <Button htmlType="button" onClick={onReset}>
            重 置
          </Button>
        </Form.Item>
      </Form>
      <Table
        dataSource={dataSource.list}
        rowKey="id"
        columns={columns || []}
        pagination={pagination}
      />
    </div>
  )
}

export default withRouter(UserQueryPane)
