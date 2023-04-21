import React, {useEffect, useState} from 'react'
import {Input, Button, Form, Select, DatePicker, Card} from 'antd'

const {RangePicker} = DatePicker
import {ORDER_STATUS} from '~/utils/const'

const SearchForm = ({onSearch, onPartialAssign}) => {
  const [form] = Form.useForm()

  const getFields = () => {
    const children = [
      <Form.Item label="订单号" name="orderNo" key="1">
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item label="手机号" name="mobile" key="2">
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item label="产品名" name="loanName" key="3">
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item label="任务下发日期" name="time" key="4">
        <RangePicker />
      </Form.Item>,
      <Form.Item label="用户名" name="userName" key="5">
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item name="orderStatus" label="状态" key="6">
        <Select style={{width: '130px'}}>
          {/*已补充、待补充、未关联（默认）、解除关联*/}
          {/*0:未补充，1：已补充,2:未关联*/}
          <Select.Option value={null}>全部</Select.Option>
          {ORDER_STATUS.map((v, i) => {
            return (
              <Select.Option value={v.key} key={i + 1}>
                {v.name}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>,
      <Form.Item label="客户经理名称" name="userManagerName" key="7">
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item label="客户经理工号" name="jobNumber" key="7">
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item label="任务类型" name="type" key="7">
        <Select style={{width: 140}}>
          <Select.Option value={null}>全部</Select.Option>
          <Select.Option value={0}>下户调查</Select.Option>
          <Select.Option value={1}>贷后检查</Select.Option>
        </Select>
      </Form.Item>,
      <Form.Item label="分配日期" name="times" key="7">
        <RangePicker />
      </Form.Item>,
    ]

    return children
  }

  const onReset = () => {
    form.resetFields()
    onSearchForm()
  }

  const onSearchForm = () => {
    const values = form.getFieldsValue()
    onSearch(values)
  }

  return (
    <Card>
      <Form
        form={form}
        onFinish={onSearchForm}
        layout="inline"
        className="searchForm"
        initialValues={{
          orderStatus: 2,
          type: null,
        }}
      >
        {getFields()}
      </Form>

      <div style={{display: 'block', marginBottom: 15}}>
        <Button type="primary" style={{marginRight: 15}} onClick={onSearchForm}>
          查询
        </Button>

        <Button style={{marginRight: 15}} onClick={onReset}>
          重置
        </Button>
      </div>

      <Button
        type="primary"
        style={{marginRight: 15}}
        onClick={() => onPartialAssign()}
      >
        选择分配
      </Button>
    </Card>
  )
}

export default SearchForm
