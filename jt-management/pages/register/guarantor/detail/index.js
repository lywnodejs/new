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
const breadcrumbs = [
  {text: '登记管理'},
  {text: '担保人列表'},
  {text: '担保人详情'},
]
function body(props) {
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
            <span>账户类型</span>
          </Col>
        </Row>
        <Row gutter={20} style={{marginTop: 30}}>
          <Col span={6}>
            <span>担保人类型</span>
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
            <span>反担保方式</span>
          </Col>
          <Col span={6}>
            <span>其他还款保证方式</span>
          </Col>
          <Col span={6}>
            <span>保证金百分比（%）</span>
          </Col>
        </Row>
        <Row gutter={20} style={{marginTop: 30}}>
          <Col span={6}>
            <span>担保业务大类</span>
          </Col>
          <Col span={6}>
            <span>担保业务种类细分</span>
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
        title="在保责任信息"
        headStyle={{
          paddingLeft: 20,
          fontWeight: 700,
          fontSize: 18,
          border: 0,
          paddingBottom: -60,
        }}
        style={{padding: '0 30px', marginTop: 20}}
      >
        <Row gutter={20}>
          <Col span={6}>
            <span>在保余额（元）</span>
          </Col>
          <Col span={6}>
            <span>余额变化日期</span>
          </Col>
          <Col span={6}>
            <span>五级分类</span>
          </Col>
          <Col span={6}>
            <span>五级分类认定日期</span>
          </Col>
        </Row>
        <Row gutter={20} style={{marginTop: 30}}>
          <Col span={6}>
            <span>代偿（垫款）标志</span>
          </Col>
          <Col span={6}>
            <span>账户状态</span>
          </Col>
          <Col span={6}>
            <span>账户关闭日期</span>
          </Col>
        </Row>
      </Card>
      <Card
        title="相关还款责任人信息"
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
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
