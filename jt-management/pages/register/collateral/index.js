import React, {useEffect, useState} from 'react'
import {Layout} from '~/components/Layout'
import {
  Space,
  message,
  DatePicker,
  Form,
  Select,
  Input,
  Button,
  Row,
} from 'antd'
import TableList from './TableList'
const {RangePicker} = DatePicker

const breadcrumbs = [{text: '登记管理'}, {text: '抵押物列表'}]

function body({router}) {
  const [form] = Form.useForm()
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Form
          form={form}
          // onFinish={onSearch}
          layout="inline"
          className="searchForm"
          initialValues={{}}
        >
          <Row>
            <Form.Item label="借据号">
              <Input placeholder="请输入借据号" />
            </Form.Item>
            <Form.Item label="手机号">
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item label="债务人名称">
              <Input placeholder="请输入债务人名称" />
            </Form.Item>
            <Form.Item label="债务人身份标识号码">
              <Input
                placeholder="请输入债务人身份标识号码"
                style={{width: 200}}
              />
            </Form.Item>
            <Form.Item label="担保方式">
              <Select style={{width: 180}}>
                <Select.Option value={null}>全部</Select.Option>
                <Select.Option value={0}>抵押</Select.Option>
                <Select.Option value={1}>质押</Select.Option>
              </Select>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item label="抵质押物种类">
              <Select style={{width: 180}}>
                <Select.Option value={null}>全部</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="抵押物唯一标识号">
              <Input
                placeholder="请输入抵押物唯一标识号"
                style={{width: 200}}
              />
            </Form.Item>
            <Form.Item
              label="登记状态"
              name="dateType"
              style={{marginLeft: 40}}
            >
              <Select style={{width: 160}}>
                <Select.Option value={null}>全部</Select.Option>
                <Select.Option value={0}>待审核</Select.Option>
                <Select.Option value={1}>已拒绝</Select.Option>
                <Select.Option value={1}>已登记</Select.Option>
                <Select.Option value={1}>已注销</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="到期日期">
              <RangePicker />
            </Form.Item>
            <Button
              type="primary"
              style={{marginRight: 15}}
              // htmlType="submit"
            >
              查询
            </Button>
            <Button style={{marginRight: 15}}>重置</Button>
            <Button type="primary" style={{marginRight: 15}}>
              导出
            </Button>
          </Row>
        </Form>

        <TableList />
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
