import React, {useEffect, useState} from 'react'
import {Input, Button, Form, Select, DatePicker} from 'antd'
import TreeMembers from '~/components/common/TreeMembers'
import moment from 'moment'

const {RangePicker} = DatePicker

const SearchForm = ({onSearch, applySources}) => {
  const [form] = Form.useForm()

  const getFields = () => {
    const children = [
      <Form.Item name="sourcePltfm" label="渠道">
        <Select style={{width: '130px'}}>
          <Select.Option value="">全部</Select.Option>
          {applySources.map((v, i) => (
            <Select.Option key={i} value={v.description}>
              {v.description}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>,
      <Form.Item label="账务日期" name="time">
        <RangePicker />
      </Form.Item>,
      <Form.Item name="blncCheckFlag" label="平衡标志">
        <Select style={{width: '130px'}}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="1">Y</Select.Option>
          <Select.Option value="0">N</Select.Option>
        </Select>
      </Form.Item>,
      <Form.Item label="身份证号" name="idcardNo">
        <Input placeholder="请输入" />
      </Form.Item>,
    ]

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
      initialValues={{
        sourcePltfm: '',
        blncCheckFlag: '',
        time: [
          moment(new Date(new Date() - 15 * 24 * 60 * 60 * 1000), 'YYYY-MM-DD'),
          moment(new Date(), 'YYYY-MM-DD'),
        ],
      }}
    >
      {getFields()}
      <Button type="primary" style={{marginRight: 15}} htmlType="submit">
        查询
      </Button>

      <Button style={{marginRight: 15}} onClick={onReset}>
        重置
      </Button>
    </Form>
  )
}

export default SearchForm
