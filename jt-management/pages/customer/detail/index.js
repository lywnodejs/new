import {Layout} from '~/components/Layout'
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from 'react'
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
import apicustomer from '~/api/customer'
import apiProduct from '~/api/product'
import Router, {withRouter} from 'next/router'
import TableListOne from './TableListOne'
import TableListTwo from './TableListTwo'
import TableListThree from './TableListThree'
import {useCookies} from 'react-cookie'
import moment from 'moment'
import AdjustmentLimitModal from './AdjustmentLimitModal'
import {values} from 'lodash'

const breadcrumbs = [{text: '客户管理'}, {text: '客户详情'}]

function body(props) {
  const [form] = Form.useForm()
  const [cookies] = useCookies(['tenantId'])
  const [customerDetail, setCustomerDetail] = useState([])
  const [productList, setProductList] = useState([])
  const [customerBasicDetail, setCustomerBasicDetail] = useState([])
  const [
    customerCreditSituationDetail,
    setCustomerCreditSituationDetail,
  ] = useState([])
  const [customerAmountChangeRecord, setCustomerAmountChangeRecord] = useState(
    [],
  )
  const [customerLetterList, setCustomerLetterList] = useState([])
  const [classificationVisble, setClassificationVisble] = useState(false)
  const [classificationDoVisble, setClassificationDoVisble] = useState(false)
  const [itemList, setItemList] = useState([])
  const [keyId, setKeyId] = useState([])
  const optionList = [
    {value: '正常', key: 1},
    {value: '关注', key: 2},
    {value: '次级', key: 3},
    {value: '可疑', key: 4},
    {value: '损失', key: 5},
  ]
  let postData = {
    customerId: props.router.query.id || props.id,
    type: props.router.query.type || props.type,
  }
  const [cardId, setCardId] = useState([])
  const [customerSecEleAcc, setCustomerSecEleAcc] = useState({})

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: {data, code},
        } = await apiProduct.get_products({tenantId: cookies.tenantId})
        if (code == 0) {
          setProductList(data)
        }
      } catch (error) {
        console.log(error)
      }
      fetchCustomerDetail()
      setKeyId(props.router.query.id || props.id)
    }
    fetchData()
  }, [])

  const fetchCustomerDetail = async () => {
    try {
      const {
        data: {data, code},
      } = await apicustomer.get_customer_detail(postData)
      if (code == 0) {
        setCustomerDetail(data)
        setCustomerBasicDetail(data.customerInfoDto)
        setCustomerCreditSituationDetail(data.userLimitAmountList)
        setCustomerAmountChangeRecord(data.userLimitAmountHis)
        setCustomerLetterList(data.customerUsedInfo)
        setCardId(data.customerInfoDto.idCard)
        setCustomerSecEleAcc(data.secEleAcc || {})
      }
    } catch (err) {
      console.log(err)
    }
  }

  const adjustment = async () => {
    setClassificationVisble(true)
  }

  const handleCancel = async () => {
    setClassificationVisble(false)
  }

  const handleOk = async () => {
    form
      .validateFields()
      .then(async (values) => {
        let {
          data: {code},
        } = await apicustomer.update_customer_fiveLevelType({
          id: props.router.query.id,
          fiveLevelType:
            typeof values.fiveLevelType == 'string'
              ? typeS(values.fiveLevelType)
              : values.fiveLevelType,
        })
        if (code == 0) {
          message.success('保存成功')
          setClassificationVisble(false)
          fetchCustomerDetail()
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const adjustmentDo = (item) => {
    setClassificationDoVisble(true)
    setItemList(item)
  }

  const handleCancelDo = () => {
    setClassificationDoVisble(false)
  }
  const productConversion = (productId) => {
    let findOne = productList.find((one) => one.id == productId)
    return findOne ? findOne.name : ''
  }

  const disabledDate = (current) => {
    return current && current < moment().subtract(1, 'days')
  }

  const typeS = (newValue) => {
    let findOne = optionList.find((one) => one.value == newValue)
    return findOne ? findOne.key : ''
  }
  useEffect(() => {
    form.setFieldsValue({
      ...customerBasicDetail,
      fiveLevelType: customerBasicDetail.fiveLevelType,
    })
  }, [classificationVisble])
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
          <Col span={8}>
            <span>客户姓名：{customerBasicDetail.name}</span>
          </Col>
          <Col span={8}>
            <span>手机号码：{customerBasicDetail.phone}</span>
          </Col>
          <Col span={8}>
            <span>客户性别：{customerBasicDetail.sex}</span>
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
            <span>客户年龄：{customerBasicDetail.age}&nbsp;岁</span>
          </Col>
          <Col span={8}>
            <span>五级分类：{customerBasicDetail.fiveLevelType}</span>
            <a style={{marginLeft: 10}} onClick={adjustment}>
              调整
            </a>
          </Col>
        </Row>
        <Modal
          title="调整五级分类"
          visible={classificationVisble}
          footer={[
            <Button key="back" onClick={handleCancel}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              保存
            </Button>,
          ]}
          onCancel={() => setClassificationVisble(false)}
        >
          <Form
            name="form"
            key={Date.now}
            form={form}
            initialValues={{
              fiveLevelType: typeS(customerBasicDetail.fiveLevelType),
            }}
          >
            <Form.Item name="fiveLevelType" label="五级分类">
              <Select
                showSearch
                style={{width: '130px', marginRight: '6px', marginLeft: 20}}
              >
                {optionList.map((v, i) => (
                  <Select.Option value={v.key} key={i}>
                    {v.value}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </Card>
      <Card
        title="二类户信息"
        headStyle={{
          paddingLeft: 20,
          fontWeight: 700,
          fontSize: 18,
          border: 0,
          paddingBottom: -60,
        }}
        style={{padding: '0 30px', marginTop: 20}}
        bordered={false}
      >
        <Row gutter={24}>
          <Col span={6}>
            {' '}
            <span>账号：{customerSecEleAcc.eleCardNo}</span>
          </Col>
          <Col span={6}>
            {' '}
            <span>总余额（元）：{customerSecEleAcc.totalAmt}</span>
          </Col>
          <Col span={6}>
            {' '}
            <span>可用余额（元）：{customerSecEleAcc.availableAmt}</span>
          </Col>
          <Col span={6}>
            {' '}
            <span>冻结余额（元）：{customerSecEleAcc.freezeAmt}</span>
          </Col>
        </Row>
      </Card>
      <Card
        title="授信情况"
        headStyle={{
          paddingLeft: 20,
          fontWeight: 700,
          fontSize: 18,
          border: 0,
          paddingBottom: -60,
        }}
        style={{padding: '0 30px', marginTop: 20}}
      >
        <span style={{fontSize: 20, fontWeight: 600}}>
          总授信额度：{customerDetail.sumFixedLimitAmount}
        </span>
        <TableListOne
          {...{
            customerCreditSituationDetail,
            adjustmentDo,
            productList,
          }}
        />
        <AdjustmentLimitModal
          {...{
            itemList,
            classificationDoVisble,
            handleCancelDo,
            productConversion,
            disabledDate,
            onHide: () => setClassificationDoVisble(false),
            keyId,
            fetchCustomerDetail,
          }}
        />
      </Card>
      <Card
        title="额度变化记录"
        headStyle={{
          paddingLeft: 20,
          fontWeight: 700,
          fontSize: 18,
          border: 0,
          paddingBottom: -60,
        }}
        style={{padding: '0 30px', marginTop: 20}}
      >
        <TableListTwo
          {...{
            customerAmountChangeRecord,
            productList,
          }}
        />
      </Card>
      <Card
        title="用信情况"
        headStyle={{
          paddingLeft: 20,
          fontWeight: 700,
          fontSize: 18,
          border: 0,
          paddingBottom: -60,
        }}
        style={{padding: '0 30px', marginTop: 20}}
      >
        <span style={{fontSize: 20, fontWeight: 600}}>
          待还本金：{customerDetail.sumUsedLimitAmount}
        </span>
        <TableListThree
          {...{
            customerLetterList,
            productList,
            keyId,
          }}
        />
      </Card>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default withRouter(body)
