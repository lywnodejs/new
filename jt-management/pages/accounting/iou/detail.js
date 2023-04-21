import {Layout} from '~/components/Layout'
import React, {useEffect, useRef, useState, useContext} from 'react'
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
import Router, {useRouter} from 'next/router'
import TableListTwo from './TableListTwo'
import TableListThree from './TableListThree'
import apiAccounting from '~/api/accounting'
import TableListFour from './TableListFour'
import TableListFive from './TableListFive'

const breadcrumbs = [
  {text: '财务核算'},
  {text: '业务数据查询'},
  {text: '借款详情'},
]
function body(props) {
  const [totalData, setTotalData] = useState([])
  const [cardId, setCardId] = useState([])
  const [plan, setPlan] = useState([])
  const [paymentRecord, setPaymentRecord] = useState([])
  const [assetProtectionsList, setAssetProtectionsList] = useState([])
  const [loanDeductRecordDtos, setLoanDeductRecordDtos] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await apiAccounting.fetch_receipt_detail({
          orderNum: router.query.orderNum || props.orderNum,
        })
        if (code == 0) {
          setTotalData(data)
          setCardId(data.idCard)
          setPlan(data.repayPlans)
          setPaymentRecord(data.deductDtos)
          setAssetProtectionsList(data.assetProtections)
          setLoanDeductRecordDtos(data.loanDeductRecordDtos)
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])
  return (
    <Layout
      isGray={true}
      breadcrumbs={breadcrumbs}
      extra={
        <Button
          onClick={() => {
            Router.back()
          }}
        >
          返回上一页
        </Button>
      }
    >
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
            <span>客户姓名：{totalData.realName}</span>
          </Col>
          <Col span={8}>
            <span>手机号码：{totalData.mobilePhone}</span>
          </Col>
          <Col span={8}>
            <span>客户性别：{totalData.sex}</span>
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
            <span>客户年龄：{totalData.age}</span>
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
            <span>产品名：{totalData.productName}</span>
          </Col>
          <Col span={8}>
            <span>借据号：{totalData.orderNum}</span>
          </Col>
          <Col span={8}>
            <span>借款状态：{totalData.statusStr}</span>
          </Col>
        </Row>
        <Row gutter={20} style={{marginTop: 30}}>
          <Col span={8}>
            <span>借款金额：{totalData.signLoanAmount}&nbsp;元</span>
          </Col>
          <Col span={8}>
            <span>应还总额：{totalData.payableAmount}&nbsp;元</span>
          </Col>
          <Col span={8}>
            <span>
              借款周期：{totalData.startDate}&nbsp;~&nbsp;{totalData.endDate}
            </span>
          </Col>
        </Row>
        <Row gutter={20} style={{marginTop: 30}}>
          <Col span={8}>
            <span>银行账号：{totalData.bankCard}</span>
          </Col>
          <Col span={8}>
            <span>开户银行：{totalData.bankName}</span>
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
        <span style={{fontSize: 20, fontWeight: 600}}>剩余未还</span>
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
              {totalData.surplusPayableAmount}
            </span>
            <span style={{flexGrow: 0.8}}>
              {totalData.surplusCapitalAmount}
            </span>
            <span style={{flexGrow: 1}}>{totalData.surplusInterestAmount}</span>
            <span style={{flexGrow: 1}}>{totalData.surplusPenaltyAmount}</span>
            <span style={{flexGrow: 1}}>
              {totalData.surplusPenaltyExtAmount}
            </span>
          </div>
        </div>
        <div style={{marginTop: 30}}>
          <span style={{fontSize: 20, fontWeight: 600}}>还款计划</span>
          <TableListTwo
            {...{
              plan,
            }}
          />
        </div>
        <div style={{marginTop: 30}}>
          <span style={{fontSize: 20, fontWeight: 600}}>还款记录</span>
          <TableListThree
            {...{
              paymentRecord,
            }}
          />
        </div>
      </Card>
      <Card
        title="还款支付流水"
        headStyle={{
          paddingLeft: 20,
          fontWeight: 700,
          fontSize: 18,
          border: 0,
          paddingBottom: -60,
        }}
        style={{padding: '0 30px', marginTop: 20}}
      >
        <TableListFive
          {...{
            loanDeductRecordDtos,
          }}
        />
      </Card>
      <Card
        title="资产保全记录"
        headStyle={{
          paddingLeft: 20,
          fontWeight: 700,
          fontSize: 18,
          border: 0,
          paddingBottom: -60,
        }}
        style={{padding: '0 30px', marginTop: 20}}
      >
        <TableListFour
          {...{
            assetProtectionsList,
          }}
        />
      </Card>
    </Layout>
  )
}

export default body
