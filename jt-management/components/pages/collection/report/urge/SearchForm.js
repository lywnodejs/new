import React, {useEffect, useState, useRef} from 'react'
import {Input, Button, Form, Select, DatePicker, Checkbox} from 'antd'

const {RangePicker} = DatePicker

const SearchForm = ({onSearch, productList, userList}) => {
  const [form] = Form.useForm()

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
      className="searchForm"
      initialValues={{
        productId: '',
        accountId: '',
      }}
    >
      <Form.Item name="productId" label="产品名">
        <Select style={{width: '130px'}}>
          <Select.Option value="">全部</Select.Option>
          {productList.map((v, i) => (
            <Select.Option key={i} value={v.id}>
              {v.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="催收员" name="accountId">
        <Select style={{width: 200}}>
          <Select.Option value="">全部</Select.Option>
          {userList.map((v, i) => {
            return (
              <Select.Option value={v.id} key={i}>
                {v.accountName}_{v.roleName}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item label="入催日期" name="time">
        <RangePicker />
      </Form.Item>

      <Form.Item label="借款期数" name="loanTerms">
        <Input placeholder="请输入" />
      </Form.Item>

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
