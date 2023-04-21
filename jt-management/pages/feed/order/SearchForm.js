import React, {useEffect, useState, useRef} from 'react'
import {Input, Button, Form, Select, DatePicker, Space} from 'antd'
import moment from 'moment'

const {RangePicker} = DatePicker

const SearchForm = ({onSearch, productList, applyStatusList}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      time: [moment(), moment()],
    })
    search()
  }, [])

  const getFields = () => {
    const children = [
      <Form.Item label="手机号/进件号" name="keyword">
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item label="进件日期" name="time">
        <RangePicker />
      </Form.Item>,
      <Form.Item label="用户名" name="realName">
        <Input placeholder="请输入" />
      </Form.Item>,
      <Form.Item name="status" label="进件状态">
        <Select style={{width: '130px'}}>
          <Select.Option value="">全部</Select.Option>
          {applyStatusList.map((v, i) => (
            <Select.Option key={i} value={v.code}>
              {v.description}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>,
      <Form.Item label="贷款产品" name="productId">
        <Select style={{width: '160px'}}>
          <Select.Option value="">全部</Select.Option>
          {productList.map((v, i) => (
            <Select.Option key={i} value={v.id}>
              {v.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>,
      // <Form.Item name="checkProgress" label="复审状态">
      //   <Select style={{width: '130px'}}>
      //     <Select.Option value="">全部</Select.Option>
      //     {checkProgressList.map((v, i) => (
      //       <Select.Option key={i} value={v.code}>
      //         {v.description}
      //       </Select.Option>
      //     ))}
      //   </Select>
      // </Form.Item>,
      // <Form.Item name="status" label="订单状态">
      //   <Select style={{width: '130px'}}>
      //     <Select.Option value="">全部</Select.Option>
      //     {statusList.map((v, i) => (
      //       <Select.Option key={i} value={v.code}>
      //         {v.description}
      //       </Select.Option>
      //     ))}
      //   </Select>
      // </Form.Item>,
    ]

    return children
  }

  const onReset = () => {
    form.resetFields()
    search()
  }

  const search = () => {
    const {time, ...params} = form.getFieldsValue()

    if (Array.isArray(time)) {
      params.beginCreateTime = moment(time[0]).format('YYYY-MM-DD')
      params.endCreateTime = moment(time[1]).format('YYYY-MM-DD')
    }
    onSearch(params)
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
        checkProgress: '',
        status: '',
      }}
    >
      {getFields()}
      <Form.Item>
        <Space>
          <Button type="primary" onClick={search}>
            查询
          </Button>

          <Button onClick={onReset}>重置</Button>
          {/*<Button type="primary">*/}
          {/*  人工进件*/}
          {/*</Button>*/}
        </Space>
      </Form.Item>
    </Form>
  )
}

export default SearchForm
