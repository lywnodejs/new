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

const breadcrumbs = [{text: '登记管理'}, {text: '担保人列表'}]

function body({router}) {
  const [form] = Form.useForm()
  const [guaranteeType, setGuaranteeType] = useState([])

  const guaranteeTypeChange = (val) => {
    console.log(val, 'val')
    if (val == 0) {
      setGuaranteeType(0)
    } else {
      setGuaranteeType(1)
    }
  }
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
            <Form.Item label="借据号" name="card">
              <Input placeholder="请输入借据号" />
            </Form.Item>
            <Form.Item label="手机号" name="phone">
              <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item label="债务人名称" name="name">
              <Input placeholder="请输入债务人名称" />
            </Form.Item>
            <Form.Item label="债务人身份标识号码" name="22">
              <Input
                placeholder="请输入债务人身份标识号码"
                style={{width: 200}}
              />
            </Form.Item>
            <Form.Item label="担保人类型" name="guarantorType">
              <Select style={{width: 180}} onChange={guaranteeTypeChange}>
                <Select.Option value={null}>全部</Select.Option>
                <Select.Option value={0}>个人担保</Select.Option>
                <Select.Option value={1}>企业担保</Select.Option>
              </Select>
            </Form.Item>
          </Row>
          <Row>
            <Form.Item label="担保业务大类" name="fee">
              {guaranteeType == 0 ? (
                <Select style={{width: 180}}>
                  <Select.Option value={null}>全部</Select.Option>
                  <Select.Option value={1}>融资担保</Select.Option>
                  <Select.Option value={2}>非融资担保</Select.Option>
                  <Select.Option value={3}>再担保</Select.Option>
                  <Select.Option value={4}>保证保险</Select.Option>
                </Select>
              ) : (
                <Select style={{width: 180}}>
                  <Select.Option value={null}>全部</Select.Option>
                  <Select.Option value={1}>融资担保</Select.Option>
                  <Select.Option value={2}>非融资担保</Select.Option>
                  <Select.Option value={3}>再担保</Select.Option>
                  <Select.Option value={4}>保证保险</Select.Option>
                  <Select.Option value={5}>信用证</Select.Option>
                  <Select.Option value={6}>承兑汇票</Select.Option>
                  <Select.Option value={7}>银行保函</Select.Option>
                </Select>
              )}
            </Form.Item>
            <Form.Item label="反担保方式" name="ssa">
              <Select style={{width: 180}}>
                <Select.Option value={null}>全部</Select.Option>
                <Select.Option value={0}>信用/免担保</Select.Option>
                <Select.Option value={2}>保证</Select.Option>
                <Select.Option value={3}>质押</Select.Option>
                <Select.Option value={4}>抵押</Select.Option>
                <Select.Option value={5}>组合</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="登记状态"
              name="dateType"
              style={{marginLeft: 40}}
            >
              <Select style={{width: 160}}>
                <Select.Option value={null}>全部</Select.Option>
                <Select.Option value={0}>待审核</Select.Option>
                <Select.Option value={2}>已拒绝</Select.Option>
                <Select.Option value={3}>已登记</Select.Option>
                <Select.Option value={4}>已注销</Select.Option>
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
