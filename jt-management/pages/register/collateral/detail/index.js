import {Layout} from '~/components/Layout'
import React, {useEffect, useRef, useState} from 'react'
import {
  Card,
  Row,
  Col,
  Select,
  Modal,
  Button,
  message,
  Form,
  Input,
  Radio,
  InputNumber,
  DatePicker,
} from 'antd'
import Router, {withRouter} from 'next/router'
import TableListOne from './TableListOne'
import TableListTwo from './TableListTwo'
const breadcrumbs = [
  {text: '登记管理'},
  {text: '抵质押物列表'},
  {text: '抵质押物详情'},
]
function body(props) {
  const [form] = Form.useForm()
  return (
    <Layout isGray={true} breadcrumbs={breadcrumbs}>
      <Card
        title="基本信息"
        headStyle={{
          paddingLeft: 20,
          fontWeight: 700,
          fontSize: 18,
          border: 0,
          paddingBottom: -60,
        }}
        style={{padding: '0 30px'}}
        bordered={false}
      >
        <Row gutter={20}>
          <Col span={6}>
            <span>借据号</span>
          </Col>
          <Col span={6}>
            <span>手机号</span>
          </Col>
          <Col span={6}>
            <span>登记状态</span>
          </Col>
          <Col span={6}>
            <span>担保类型</span>
          </Col>
        </Row>
        <Row gutter={20} style={{marginTop: 30}}>
          <Col span={6}>
            <span>债务人身份类别</span>
          </Col>
          <Col span={6}>
            <span>债务人名称</span>
          </Col>
          <Col span={6}>
            <span>债务人身份标识类型</span>
          </Col>
          <Col span={6}>
            <span>
              债务人身份标识号码:
              {/* {cardId.toString().replace(/^(.{6})(?:\d+)(.{4})$/, '$1******$2')} */}
            </span>
          </Col>
        </Row>
        <Row gutter={20} style={{marginTop: 30}}>
          <Col span={6}>
            <span>担保金额（元）</span>
          </Col>
          <Col span={6}>
            <span>最高额担保标志</span>
          </Col>
          <Col span={6}>
            <span>生效日期</span>
          </Col>
          <Col span={6}>
            <span>到期日期</span>
          </Col>
        </Row>
      </Card>
      <Card
        title="其他债务人信息"
        headStyle={{
          paddingLeft: 20,
          fontWeight: 700,
          fontSize: 18,
          border: 0,
          paddingBottom: -60,
        }}
        style={{padding: '0 30px', marginTop: 20}}
      >
        <TableListOne />
      </Card>
      <Card
        title="抵押物信息"
        headStyle={{
          paddingLeft: 20,
          fontWeight: 700,
          fontSize: 18,
          border: 0,
          paddingBottom: -60,
        }}
        style={{padding: '0 30px', marginTop: 20}}
      >
        <TableListTwo />
      </Card>
      <Card
        title="估价审核"
        headStyle={{
          paddingLeft: 20,
          fontWeight: 700,
          fontSize: 18,
          border: 0,
          paddingBottom: -60,
        }}
        style={{padding: '0 30px', marginTop: 20}}
      >
        <Form
          form={form}
          // onFinish={onSearch}
          // layout="inline"
          // className="searchForm"
          // initialValues={{
          //   productId: null,
          //   status: null,
          //   dateType: null,
          // }}
          style={{marginLeft: 200}}
        >
          <Form.Item label="估价总计">
            <p>1,100,000 元</p>
          </Form.Item>
          <Form.Item label="审核结果">
            <Select
              style={{width: 300}}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            >
              <Select.Option>请选择</Select.Option>
              <Select.Option>通过</Select.Option>
              <Select.Option>拒绝</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="备注" style={{width: 350}}>
            <Input.TextArea style={{marginLeft: 25}} />
          </Form.Item>
          <Button type="primary" style={{marginLeft: 160}}>
            提交
          </Button>
        </Form>
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
