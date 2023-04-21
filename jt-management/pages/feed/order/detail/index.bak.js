import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Card, Button, Row, Col, Steps, Tabs} from 'antd'
import {useCookies} from 'react-cookie'
import Router, {withRouter} from 'next/router'
import RepayList from '../RepayList'
import TableList from './TableList'
import api from '~/api/order'
import apiProduct from '~/api/product'
const {Step} = Steps
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const {TabPane} = Tabs
const breadcrumbs = [{text: '进件管理'}, {text: '进件列表'}, {text: '详情'}]

function body({
  checkProgressList,
  grantForms,
  repayForms,
  applySources,
  router,
  operationTypes,
  statusList,
}) {
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [detail, setDetail] = useState({
    engineNotifyRejectCodeList: [],
    checkProgressRejectCodeList: [],
    userInfo: [],
    workInfo: [],
    otherContactsInfo: [],
    certificatesInfo: [],
  })
  const [activeIndex, setActiveIndex] = useState(-1)
  const [list, setList] = useState({list: []})
  const [isHasMoreWater, setIsHasMoreWater] = useState(false)
  const [activeKey, setActiveKey] = useState('1')

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await apiProduct.get_products({tenantId: cookies.tenantId})
        if (code == 0) {
          setProductList(data)
        }

        fetchList()
        fetchWater()
      } catch (error) {
        console.log(error)
      }
    }
    fetchData()
  }, [])

  const fetchWater = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_loan_water({
        ...pageParams,
        loanApplyId: router.query.id,
      })
      if (code === 0) {
        if (data && data.list && data.list.length) {
          setList({list: data.list.slice(0, 5)})
          if (data.list.length > 5) {
            setIsHasMoreWater(true)
          }
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchList = async () => {
    try {
      const {
        data: {data, code},
      } = await api.fetch_all_list(router.query.id)
      if (code === 0) {
        setDetail(data)
        const statusList = data.loanApplyStatusDetail
        if (Array.isArray(statusList) && statusList.length) {
          const unActiveIndex = statusList.findIndex((one) => !one.updateTime)
          setActiveIndex(
            unActiveIndex == -1 ? statusList.length - 1 : unActiveIndex - 1,
          )
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const checkMore = () => {
    let url = `/feed/order/form?id=${router.query.id}&tag=repayWater`
    Router.push(url)
  }
  const changeTab = async (key, showError) => {
    setActiveKey(key)
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Card title={`借据号：${detail.orderNum}`}>
        <Row gutter={[0, 8]}>
          <Col span={8}>姓名：{detail.realName}</Col>
          <Col span={8}>手机号：{detail.mobilePhone}</Col>
          <Col span={8}>身份证号：{detail.idCard}</Col>
        </Row>
        <Row gutter={[0, 8]}>
          <Col span={8}>
            申请产品：
            {(function () {
              let findOne = productList.find(
                (one) => one.id == detail.productId,
              )
              return findOne ? findOne.name : ''
            })()}
          </Col>
          <Col span={8}>申请时间：{detail.createTime}</Col>
          <Col span={8}>
            放款方式：
            {(function () {
              let findOne = grantForms.find(
                (one) => one.code == detail.grantForm,
              )
              return findOne ? findOne.description : ''
            })()}
          </Col>
        </Row>
        <Row gutter={[0, 8]}>
          <Col span={8}>
            借款渠道：
            {(function () {
              let findOne = applySources.find(
                (one) => one.code == detail.applySource,
              )
              return findOne ? findOne.description : ''
            })()}
          </Col>
          <Col span={8}>申请金额：{detail.signLoanAmount}</Col>
          <Col span={8}>申请期限：{detail.loanApplyTerms}</Col>
        </Row>
      </Card>
      <Card title="状态信息" style={{marginTop: '20px'}}>
        <Steps current={activeIndex} progressDot>
          {detail.loanApplyStatusDetail &&
            detail.loanApplyStatusDetail.length &&
            detail.loanApplyStatusDetail.map((one) => (
              <Step title={one.statusDesc} description={one.updateTime} />
            ))}
        </Steps>
      </Card>
      <Card title="订单信息" style={{marginTop: '20px'}}>
        <Row>
          <Col span={8}>
            借款渠道：
            {(function () {
              let findOne = applySources.find(
                (one) => one.code == detail.applySource,
              )
              return findOne ? findOne.description : ''
            })()}
          </Col>
          <Col span={8}>
            申请产品：
            {(function () {
              let findOne = productList.find(
                (one) => one.id == detail.productId,
              )
              return findOne ? findOne.name : ''
            })()}
          </Col>
          <Col span={8}>申请金额：{detail.signLoanAmount}</Col>
        </Row>
        <Row>
          <Col span={8}>年化利率：{detail.interest}</Col>
          <Col span={8}>申请期限：{detail.loanApplyTerms}</Col>
          <Col span={8}>确认提现时间：{detail.regFinishTime}</Col>
        </Row>
        <Row>
          <Col span={24}>
            还款方式：
            {(function () {
              let findOne = applySources.find(
                (one) => one.code == detail.repaymentType,
              )
              return findOne ? findOne.description : ''
            })()}
          </Col>
        </Row>
        <Row>
          <Col span={8}>决策开始时间：{detail.engineNotifyTime}</Col>
          <Col span={8}>决策审批结果：{detail.engineNotifyResult}</Col>
          <Col span={8}>
            决策拒绝原因：
            {detail.engineNotifyRejectCodeList &&
            detail.engineNotifyRejectCodeList.length
              ? '详情'
              : '无'}
          </Col>
        </Row>
        <Row>
          <Col span={8}>信审开始时间：{detail.checkProgressFinishTime}</Col>
          <Col span={8}>
            信审结果：
            {(function () {
              let findOne = checkProgressList.find(
                (one) => one.code == detail.checkProgress,
              )
              return findOne ? findOne.description : ''
            })()}
          </Col>
          <Col span={8}>
            信审拒绝原因：
            {detail.checkProgressRejectCodeList &&
            detail.checkProgressRejectCodeList.length
              ? '详情'
              : '无'}
          </Col>
        </Row>
      </Card>
      <Card title="支付信息" style={{marginTop: '20px'}}>
        <RepayList
          {...{hidePage: true, list, operationTypes, statusList, pageParams}}
        />
        {isHasMoreWater && (
          <div style={{textAlign: 'center'}}>
            <Button type="link" onClick={() => checkMore()}>
              查看更多
            </Button>
          </div>
        )}
      </Card>
      <Card title="用户基本信息" style={{marginTop: '20px'}}>
        <Tabs activeKey={activeKey} onTabClick={(key) => changeTab(key, false)}>
          <TabPane tab="个人资信" key="1" forceRender={true}>
            <TableList list={detail.userInfo} />
          </TabPane>
          <TabPane tab="工作情况" key="2" forceRender={true}>
            <TableList list={detail.workInfo} />
          </TabPane>
          <TabPane tab="其他联系人" key="3" forceRender={true}>
            <TableList
              list={detail.otherContactsInfo}
              isHasMore={true}
              userId={detail.userId}
            />
          </TabPane>
          <TabPane tab="文件资料" key="4" forceRender={true}>
            <TableList list={detail.certificatesInfo} />
          </TabPane>
        </Tabs>
        <Button type="primary" style={{marginTop: 15}}>
          补充资料
        </Button>
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  const backData = {
    checkProgressList: [],
    grantForms: [],
    applySources: [],
    repayForms: [],
    operationTypes: [],
    statusList: [],
  }

  try {
    const [
      {
        data: {data, code},
      },
      {
        data: {data: grantForms, code: statusCode},
      },
      {
        data: {data: applySources, code: applyCode},
      },
      {
        data: {data: repayForms, code: repayCode},
      },
      {
        data: {data: operationTypes, code: operationCode},
      },
      {
        data: {data: statusList, code: slCode},
      },
    ] = await Promise.all([
      api.get_data_dict('LOAN_CHECK_PROGRESS'),
      api.get_data_dict('LOAN_GRANT_FORM'),
      api.get_data_dict('LOAN_APPLY_SOURCE'),
      api.get_data_dict('LOAN_REPAY_FORM'),
      api.get_data_dict('LOAN_DEDUCT_COMMOND_TYPE'),
      api.get_data_dict('LOAN_DEDUCT_COMMOND_STATUS'),
    ])

    if (code == 0) {
      return {
        checkProgressList: data,
        grantForms: statusCode === 0 ? grantForms : [],
        applySources: applyCode === 0 ? applySources : [],
        repayForms: repayCode === 0 ? repayForms : [],
        operationTypes: operationCode === 0 ? operationTypes : [],
        statusList: slCode === 0 ? statusList : [],
      }
    }
    backData.code = code
    return backData
  } catch (err) {
    console.log(err)
    return backData
  }
}

export default withRouter(body)
