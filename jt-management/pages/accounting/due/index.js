import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {
  Space,
  message,
  DatePicker,
  Form,
  Select,
  Input,
  Button,
  Row,
  Col,
} from 'antd'
import TableList from './TableList'
import apiAccounting from '~/api/accounting'
import apiProduct from '~/api/product'
import moment from 'moment'
import {useCookies} from 'react-cookie'

const {RangePicker} = DatePicker
const breadcrumbs = [
  {text: '财务核算'},
  {text: '资产监测'},
  {text: '贷款到期台账'},
]
const pageParams = {
  pageNum: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [list, setList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [form] = Form.useForm()
  const [productList, setProductList] = useState([])
  const [cookies] = useCookies(['tenantId'])

  useEffect(() => {
    fetchLoanList()
    getproductList()
  }, [])
  const fetchLoanList = async (values = {}) => {
    try {
      const {time, date} = values
      if (Array.isArray(date)) {
        values = {
          ...values,
          deductDateStart: moment(date[0]).format('YYYY-MM-DD'),
          deductDateEnd: moment(date[1]).format('YYYY-MM-DD'),
        }
      } else if (date === undefined) {
        values = {
          ...values,
          deductDateStart: moment(new Date()).format('YYYY-MM-DD'),
          deductDateEnd: moment(new Date()).format('YYYY-MM-DD'),
        }
      } else if (date === null) {
        values = {
          ...values,
          deductDateStart: null,
          deductDateEnd: null,
        }
      }
      if (Array.isArray(time)) {
        values = {
          ...values,
          interestDateStart: moment(time[0]).format('YYYY-MM-DD'),
          interestDateEnd: moment(time[1]).format('YYYY-MM-DD'),
        }
      }
      delete values.date
      delete values.time
      const {
        data: {data, code},
      } = await apiAccounting.fetch_loanPlanExpire_list({
        ...pageParams,
        ...values,
      })
      if (code == 0) {
        setTotalData(data)
        setList(data.list)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getproductList = async () => {
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
  }

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNum = 1
    fetchLoanList({...values})
  }
  const onReset = () => {
    form.resetFields()
    onSearch({})
  }
  const onPage = async () => {
    fetchLoanList(values)
  }
  const exportExcel = async () => {
    const values = form.getFieldValue()
    let postData = {}
    let postData1 = {}
    try {
      if (Array.isArray(values.date)) {
        postData = {
          deductDateStart: moment(values.date[0]).format('YYYY-MM-DD'),
          deductDateEnd: moment(values.date[1]).format('YYYY-MM-DD'),
        }
      } else if (values.date === undefined) {
        postData = {
          deductDateStart: moment(new Date()).format('YYYY-MM-DD'),
          deductDateEnd: moment(new Date()).format('YYYY-MM-DD'),
        }
      } else if (date === null) {
        postData = {
          deductDateStart: null,
          deductDateEnd: null,
        }
      }

      if (Array.isArray(values.time)) {
        postData1 = {
          interestDateStart: moment(values.time[0]).format('YYYY-MM-DD'),
          interestDateEnd: moment(values.time[1]).format('YYYY-MM-DD'),
        }
      }
      delete values.date
      delete values.time
      const {
        data: {data, code},
      } = await apiAccounting.fetch_loanList_export({
        ...postData,
        ...values,
        ...postData1,
      })
      if (code == 0) {
        window.open(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Form
          form={form}
          onFinish={onSearch}
          layout="inline"
          className="searchForm"
          initialValues={{
            productId: null,
            date: [
              moment(new Date(), 'YYYY-MM-DD'),
              moment(new Date(), 'YYYY-MM-DD'),
            ],
          }}
        >
          <Row gutter={24}>
            <Col span={6}>
              <Form.Item label="产品名称" name="productId">
                <Select style={{width: 200}}>
                  <Select.Option value={null}>全部</Select.Option>
                  {productList.map((v, i) => (
                    <Select.Option key={i} value={v.id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="客户名称" name="realName">
                <Input placeholder="请输入" style={{width: 200}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="证件号码" name="idcard">
                <Input placeholder="请输入" style={{width: 200}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="客户经理" name="cust">
                <Input placeholder="客户经理姓名/工号" style={{width: 200}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="借据号" name="orderNum">
                <Input placeholder="请输入" style={{width: 200}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="起息日" name="time">
                <RangePicker style={{width: 240}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="应还日期" name="date">
                <RangePicker style={{width: 240}} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <span>
                <Button
                  type="primary"
                  style={{marginRight: 15}}
                  htmlType="submit"
                >
                  查询
                </Button>
                <Button style={{marginRight: 15}} onClick={onReset}>
                  重置
                </Button>
                <Button
                  style={{marginRight: 15}}
                  onClick={exportExcel}
                  type="primary"
                >
                  导出
                </Button>
              </span>
            </Col>
          </Row>
        </Form>

        <TableList
          {...{
            list,
            totalData,
            onPage,
            pageParams,
            productList,
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
