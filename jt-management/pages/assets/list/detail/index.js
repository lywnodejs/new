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
  Table,
} from 'antd'
import Router, {withRouter} from 'next/router'
import TableListTwo from './TableListTwo'
import TableListThree from './TableListThree'
import TableListFour from './TableListFour'
import apiAssets from '~/api/assets'
const {TextArea} = Input

const breadcrumbs = [
  {text: '资产保全'},
  {text: ' 资产列表'},
  {text: '资产详情'},
]

function body(props) {
  const [customerInfo, setCustomerInfo] = useState([])
  const [cardId, setCardId] = useState([])
  const [plan, setPlan] = useState([])
  const [paymentRecord, setPaymentRecord] = useState([])
  const [protectionRecord, setProtectionRecord] = useState([])
  const [deductionList, setDeductionList] = useState([])
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const newProtectionType = props.router.query.protectionType

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const {
        data: {data, code},
      } = await apiAssets.fetch_capital_detail({
        orderNum: props.router.query.orderNum,
      })
      if (code == 0) {
        setCustomerInfo(data.receiptDetailDto)
        setCardId(data.receiptDetailDto.idCard)
        setPlan(data.receiptDetailDto.repayPlans)
        setPaymentRecord(data.receiptDetailDto.deductDtos)
        setProtectionRecord(data.protectionLogList)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deductionL = async () => {
    try {
      const {
        data: {data, code},
      } = await apiAssets.fetch_interest_deduction({
        orderNum: props.router.query.orderNum,
      })
      if (code == 0) {
        setDeductionList(data)
        form.setFieldsValue(data)
        setVisible(true)
      }
      if (code == -1) {
        setVisible(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deduction = () => {
    deductionL()
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    let postData = {
      ...values,
      orderNum: props.router.query.orderNum,
      userName: deductionList.userName,
      maxReductionAmount: deductionList.maxReductionAmount,
      realReductionAmount: Number(values.realReductionAmount),
    }
    try {
      const {
        data: {data, code},
      } = await apiAssets.fetch_add_deduction(postData)
      if (code == 0) {
        if (
          newProtectionType == 2 ||
          newProtectionType == 3 ||
          newProtectionType == 4
        ) {
          return Modal.info({
            content: <p>已核销或已转让的借据不可操作</p>,
            onOk() {},
          })
        } else {
          message.success('提交成功')
          fetchData()
          setVisible(false)
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Layout isGray={true} breadcrumbs={breadcrumbs}>
      <Card
        title="客户信息"
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
          <Col span={8}>
            <span>客户姓名：{customerInfo.realName}</span>
          </Col>
          <Col span={8}>
            <span>手机号码：{customerInfo.mobilePhone}</span>
          </Col>
          <Col span={8}>
            <span>客户性别：{customerInfo.sex}</span>
          </Col>
        </Row>
        <Row gutter={20} style={{marginTop: 30}}>
          <Col span={8}>
            <span>
              身份证号：
              {cardId.toString().replace(/^(.{6})(?:\d+)(.{4})$/, '$1******$2')}
            </span>
          </Col>
          <Col span={8}>
            <span>客户年龄：{customerInfo.age}&nbsp;岁</span>
          </Col>
        </Row>
      </Card>
      <Card
        title="借款信息"
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
          <Col span={8}>
            <span>产品名：{customerInfo.productName}</span>
          </Col>
          <Col span={8}>
            <span>借据号：{customerInfo.orderNum}</span>
          </Col>
          <Col span={8}>
            <span>借款状态：{customerInfo.statusStr}</span>
          </Col>
        </Row>
        <Row gutter={20} style={{marginTop: 30}}>
          <Col span={8}>
            <span>借款金额：{customerInfo.signLoanAmount}&nbsp;元</span>
          </Col>
          <Col span={8}>
            <span>应还总额：{customerInfo.payableAmount}&nbsp;元</span>
          </Col>
          <Col span={8}>
            <span>
              借款周期：{customerInfo.startDate}&nbsp;~&nbsp;
              {customerInfo.endDate}
            </span>
          </Col>
        </Row>
        <Row gutter={20} style={{marginTop: 30}}>
          <Col span={8}>
            <span>银行账号：{customerInfo.bankCard}</span>
          </Col>
          <Col span={8}>
            <span>开户银行：{customerInfo.bankName}</span>
          </Col>
        </Row>
      </Card>
      <Card
        title="还款情况"
        headStyle={{
          paddingLeft: 20,
          fontWeight: 700,
          fontSize: 18,
          border: 0,
          paddingBottom: -60,
        }}
        style={{padding: '0 30px', marginTop: 20}}
      >
        <p style={{fontWeight: 'bold'}}>剩余未还</p>
        <div style={{marginTop: 20}}>
          <div
            style={{
              backgroundColor: '#fafafa',
              width: '100%',
              height: 60,
              display: 'flex',
              flexDirection: 'row',
              color: '#262626',
              textAlign: 'center',
              paddingTop: 20,
            }}
          >
            <span style={{flexGrow: 1}}>剩余总额（元）</span>
            <span style={{flexGrow: 1}}>剩余本金（元）</span>
            <span style={{flexGrow: 1}}>剩余利息（元）</span>
            <span style={{flexGrow: 1}}>剩余本金罚息（元）</span>
            <span style={{flexGrow: 1}}>剩余利息罚息（元）</span>
            <span style={{flexGrow: 1}}>操作</span>
          </div>
          <div
            style={{
              width: '100%',
              height: 60,
              display: 'flex',
              flexDirection: 'row',
              color: '#262626',
              textAlign: 'center',
              paddingTop: 20,
            }}
          >
            <span style={{flexGrow: 0.8}}>
              {customerInfo.surplusPayableAmount}
            </span>
            <span style={{flexGrow: 0.8}}>
              {customerInfo.surplusCapitalAmount}
            </span>
            <span style={{flexGrow: 1}}>
              {customerInfo.surplusInterestAmount}
            </span>
            <span style={{flexGrow: 1}}>
              {customerInfo.surplusPenaltyAmount}
            </span>
            <span style={{flexGrow: 1}}>
              {customerInfo.surplusPenaltyExtAmount}
            </span>
            <span style={{flexGrow: 0.4}}>
              <a onClick={deduction}>利息减免</a>
            </span>
          </div>
        </div>
        <p style={{fontWeight: 'bold', marginTop: 20}}>还款计划</p>
        <TableListTwo
          {...{
            plan,
          }}
        />
        <p style={{fontWeight: 'bold', marginTop: 20}}>还款记录</p>
        <TableListThree
          {...{
            paymentRecord,
          }}
        />
        <p style={{fontWeight: 'bold', marginTop: 20}}>资产保全记录</p>
        <TableListFour
          {...{
            protectionRecord,
            fetchData,
          }}
        />

        <Modal
          visible={visible}
          title="申请利息减免"
          footer={[
            <Button key="back" onClick={() => setVisible(false)}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={handleSubmit}>
              提交
            </Button>,
          ]}
          onCancel={() => setVisible(false)}
        >
          <Form form={form} key={Date.now} name="form" style={{marginLeft: 20}}>
            <Form.Item label="借款人">
              <span>{deductionList.userName}</span>
            </Form.Item>
            <Form.Item label="最大可减免金额">
              <span>
                {Number(deductionList.maxReductionAmount).toLocaleString()}
                &nbsp;元
              </span>
            </Form.Item>
            <Form.Item
              label="减免金额"
              name="realReductionAmount"
              rules={[
                {required: true, message: '请输入减免金额'},
                ({getFieldValue}) => ({
                  validator(rule, value) {
                    var reg = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/
                    if (value && !reg.test(value)) {
                      return Promise.reject(
                        '请输入大于等于0的数，并且最多保留2位小数',
                      )
                    }
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Input suffix="元" style={{width: 180}} />
            </Form.Item>
            <Form.Item
              label="减免原因"
              name="launchRemark"
              rules={[{required: true, message: '请输入减免原因'}]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
