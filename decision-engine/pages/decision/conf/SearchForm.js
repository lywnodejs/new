import React, {useEffect, useState, useRef} from 'react'
import {Input, Button, Form, Select, DatePicker} from 'antd'
const {RangePicker} = DatePicker
import moment from 'moment'
const SearchForm = ({
  onSearch,
  actionTypes,
  verifyStatus,
  onAdd,
  onDelete,
  onCopy,
  onPublish,
  form,
}) => {
  const getFields = () => {
    const children = [
      <Form.Item label="选择日期" name="time">
        <RangePicker />
      </Form.Item>,
      <Form.Item label="规则编号" name="ruleCode">
        <Input placeholder="请输入" />
      </Form.Item>,

      <Form.Item label="修改类型" name="operatorType">
        <Select
          style={{width: '160px'}}
          onChange={(val) => changeOperatorType(val)}
        >
          <Select.Option value="">全部</Select.Option>
          <Select.Option value="2">修改</Select.Option>
          <Select.Option value="1">新增</Select.Option>
          <Select.Option value="4">启用/禁用</Select.Option>
        </Select>
      </Form.Item>,
    ]

    return children
  }
  const changeOperatorType = (val) => {
    form.setFieldsValue('operatorType', val)
  }

  const onReset = () => {
    form.resetFields()
  }

  return (
    <Form
      form={form}
      onFinish={(values) =>
        onSearch({
          ...values,
        })
      }
      layout="inline"
      initialValues={{
        actionType: '',
        stage: '',
        time: [
          moment(new Date(), 'YYYY-MM-DD'),
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
