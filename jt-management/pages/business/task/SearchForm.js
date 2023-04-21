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

const SearchForm = (props) => {
  const [picker, setPicker] = useState('month')
  useEffect(() => {
    props.form.setFieldsValue({
      time: getInitDay(),
    })
  }, [])

  useEffect(() => {
    props.form.setFieldsValue({
      time: getInitMouth(),
    })
    setPicker('month')
  }, [props.activeKey])

  const changeReportType = (val) => {
    setPicker(val == 1 ? 'month' : 'date')
    props.form.setFieldsValue({
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
      <Form.Item name="loanName" label="产品名称">
        <Select style={{width: '130px'}}>
          <Select.Option value={null}>全部</Select.Option>
          {props.proList.map((v, i) => (
            <Select.Option key={i} value={v}>
              {v}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>,
    ]
    if (props.activeKey == 1 || props.activeKey == 2) {
      children = [
        ...children,
        <Form.Item name="networkId" label="网点名称">
          <Select style={{width: '130px'}}>
            <Select.Option value={null}>全部</Select.Option>
            {props.branch4search.map((v, i) => (
              <Select.Option key={i} value={v.id}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>,
      ]
    }

    if (props.activeKey == 2) {
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

  return (
    <Form
      form={props.form}
      layout="inline"
      className="searchForm"
      initialValues={{
        time: [...getInitMouth()],
        loanName: null,
        networkId: null,
        reportType: '1',
      }}
    >
      {getFields()}
      <Button
        type="primary"
        style={{marginRight: 15}}
        onClick={() => props.onSearch()}
      >
        查询
      </Button>

      <Button
        type="primary"
        style={{marginRight: 15}}
        onClick={() => props.onSearch('export')}
      >
        导出
      </Button>
    </Form>
  )
}

export default SearchForm
