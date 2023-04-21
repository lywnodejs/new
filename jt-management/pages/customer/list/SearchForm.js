import React, {useEffect, useState, useRef} from 'react'
import {Input, Button, Form, Select, DatePicker, InputNumber} from 'antd'

const SearchForm = ({onSearch, fetchList}) => {
  const [form] = Form.useForm()

  const getFields = () => {
    const children = [
      <Form.Item label="编号" name="id">
        <InputNumber
          placeholder="请输入编号"
          style={{width: 130}}
          max={99999999999}
          min={1}
        />
      </Form.Item>,
      <Form.Item label="客户名称" name="name">
        <Input
          placeholder="请输入客户名称"
          style={{width: 130}}
          maxLength={20}
        />
      </Form.Item>,
      <Form.Item label="手机号" name="phone">
        <Input placeholder="请输入手机号" style={{width: 130}} maxLength={11} />
      </Form.Item>,
      <Form.Item label="五级分类" name="fiveLevelType">
        <Select style={{width: 130}}>
          <Select.Option value="">全部</Select.Option>
          <Select.Option value={'1'}>正常</Select.Option>
          <Select.Option value={'2'}>关注</Select.Option>
          <Select.Option value={'3'}>次级</Select.Option>
          <Select.Option value={'4'}>可疑</Select.Option>
          <Select.Option value={'5'}>损失</Select.Option>
        </Select>
      </Form.Item>,
    ]

    return children
  }

  const onReset = () => {
    form.resetFields()
    onSearch({})
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
      className="searchForm"
      initialValues={{
        fiveLevelType: '',
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
