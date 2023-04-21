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

  if (code == 0) {
    return data
  }
  return {totalSize: 0, list: []}
}

function DetailQueryPane() {
  const [form] = Form.useForm()
  const [indexGroup, setIndexGroup] = useState([])
  const [dataSource, setDataSource] = useState({totalSize: 0, list: []})
  const indexType = [
    {indicatorsType: 'base', indicatorsTypeName: '基础指标'},
    {indicatorsType: 'derivation', indicatorsTypeName: '衍生指标'},
  ]

  // date
  const [dates, setDates] = useState([])
  const [hackValue, setHackValue] = useState()
  const [value, setValue] = useState()

  useEffect(() => {
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

  const updateList = async (params = {}) => {
    console.log('params', params)
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

  const onReset = () => {
    form.resetFields()
  }

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

  const onExport = async () => {
    if (!variableIds.length) {
      return message.error('请选择项目')
    }
    try {
      const {data, status} = await api.export_risk_vertifyrecord({
        ids: variableIds.join(','),
        moduleType: activeModuleKey,
        productId: activeKey,
      })
      if (status == 200) {
        console.log(data)
        var blob = new Blob([data], {
          type:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        var objectUrl = URL.createObjectURL(blob)
        var a = document.createElement('a')
        document.body.appendChild(a)
        a.setAttribute('style', 'display:none')
        a.setAttribute('href', objectUrl)
        a.setAttribute('download', '对照详情.xlsx')
        a.click()
        URL.revokeObjectURL(objectUrl)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onChange = (current, pageSize) => {
    console.log('onChange:', current, pageSize)
    pageParams.pageSize = pageSize
    pageParams.pageNo = current
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
        style={{backgroundColor: '#FFFFFF'}}
        initialValues={{time: [moment().subtract(6, 'day'), moment()]}}
      >
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
        <Form.Item label="调用日期" name="time">
          <RangePicker
            value={hackValue || value}
            disabledDate={disabledDate}
            onCalendarChange={(val) => setDates(val)}
            onChange={(val) => setValue(val)}
            onOpenChange={onOpenChange}
            // defaultValue={[moment().subtract(6, 'day'), moment()]}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{marginRight: 15}} htmlType="submit">
            查 询
          </Button>
          <Button htmlType="button" onClick={onReset} style={{marginRight: 15}}>
            重 置
          </Button>
          {/* <Button type="primary" onClick={onExport}>
            导 出
          </Button> */}
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

export default withRouter(DetailQueryPane)
