import React, {useEffect, useState} from 'react'
import {Input, Button, Form, Select, DatePicker} from 'antd'
import moment from 'moment'

const {RangePicker} = DatePicker

const getInitDay = () => {
  const currentDay = moment().format('YYYY-MM-DD')
  const firstDay = moment().format('YYYY-MM') + '-01'
  return [moment(firstDay), moment(currentDay)]
}

const getInitMouth = () => {
  const mouth = moment().format('YYYY-MM')
  return [moment(mouth), moment(mouth)]
}

const SearchForm = ({onSearch, netWorks, activeKey, proList}) => {
  const [picker, setPicker] = useState('date')
  const [form] = Form.useForm()

  useEffect(() => {
    form.resetFields()
    setPicker('date')
    form.setFieldsValue({
      time: getInitDay(),
    })
    onSearch(form.getFieldsValue())
  }, [activeKey])

  const downloadData = () => {
    onSearch(form.getFieldsValue(), true)
  }

  const changeReportType = (val) => {
    setPicker(val == 1 ? 'month' : 'date')
    form.setFieldsValue({
      time: val == 1 ? getInitMouth() : getInitDay(),
    })
  }

  const getFields = () => {
    let children = [
      <Form.Item name="reportType" label="报表类型">
        <Select style={{width: '130px'}} onChange={changeReportType}>
          <Select.Option value="0">日报表</Select.Option>
          <Select.Option value="1">月报表</Select.Option>
          <Select.Option value="2">统计报表</Select.Option>
        </Select>
      </Form.Item>,

      <Form.Item label="日期选择" name="time">
        <RangePicker picker={picker} />
      </Form.Item>,
      <Form.Item name="networkId" label="网点名称">
        <Select style={{width: '130px'}}>
          <Select.Option value={null}>全部</Select.Option>
          {netWorks.map((v, i) => (
            <Select.Option key={i} value={v.id}>
              {v.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>,
      <Form.Item name="productId" label="产品名称">
        <Select style={{width: '130px'}}>
          <Select.Option value={null}>全部</Select.Option>
          {Array.isArray(proList) &&
            proList.map((v, i) => (
              <Select.Option key={i} value={v.id}>
                {v.productName}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>,
    ]
    if (activeKey == 1) {
      children = [
        ...children,
        <Form.Item name="managerName" label="客户经理">
          <Input />
        </Form.Item>,
        <Form.Item name="jobNumber" label="工号">
          <Input />
        </Form.Item>,
      ]
    }
    return children
  }

  const onReset = () => {
    form.resetFields()
  }

  return (
    <Form
      form={form}
      onFinish={onSearch}
      layout="inline"
      className="searchForm"
      initialValues={{
        reportType: '0',
        networkId: null,
        productId: null,
      }}
    >
      {getFields()}
      <Button type="primary" style={{marginRight: 15}} htmlType="submit">
        查询
      </Button>

      <Button type="primary" style={{marginRight: 15}} onClick={downloadData}>
        导出
      </Button>
    </Form>
  )
}

export default SearchForm
