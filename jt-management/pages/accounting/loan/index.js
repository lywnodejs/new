import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, DatePicker, Form, Select, Input, Button} from 'antd'
import TableList from './TableList'
import apiAccounting from '~/api/accounting'
import apiProduct from '~/api/product'
import {useCookies} from 'react-cookie'
import moment from 'moment'

const {RangePicker} = DatePicker
const breadcrumbs = [
  {text: '财务核算'},
  {text: '业务数据查询'},
  {text: '放款台账'},
]
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [list, setList] = useState([])
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [totalNum, setTotalNum] = useState([])
  const [totalData, setTotalData] = useState([])
  const [accountList, setAccountList] = useState([])
  const [form] = Form.useForm()
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
      fetchIncometList()
      fetchAccount()
    }
    fetchData()
  }, [])
  const fetchIncometList = async (values = {}) => {
    try {
      const {time} = values
      if (time === undefined) {
        values = {
          ...values,
          grantDateStart: moment(getCurrentMonthFirst()).format('YYYY-MM-DD'),
          grantDateEnd: moment(new Date()).format('YYYY-MM-DD'),
        }
      } else if (time === null) {
        values = {
          ...values,
          startTime: null,
          endTime: null,
        }
      } else if (Array.isArray(time)) {
        values = {
          ...values,
          grantDateStart: moment(time[0]).format('YYYY-MM-DD'),
          grantDateEnd: moment(time[1]).format('YYYY-MM-DD'),
        }
      }
      delete values.time
      const {
        data: {data, code},
      } = await apiAccounting.fetch_grantList_list({...pageParams, ...values})
      if (code == 0) {
        setTotalNum(data.grantTotal)
        setList(data.pageInfo.list)
        setTotalData(data.pageInfo)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchAccount = async () => {
    try {
      const {
        data: {data, code},
      } = await apiAccounting.get_data_dict('FUND_PAY_CHANNEL_MERCHANT_CODE')
      if (code == 0) {
        setAccountList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNo = 1
    fetchIncometList({...values})
  }
  const onReset = () => {
    form.resetFields()
    onSearch({})
  }
  const onPage = async () => {
    fetchIncometList(values)
  }
  const getCurrentMonthFirst = () => {
    var date = new Date()
    date.setDate(1)
    return date
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
            time: [
              moment(getCurrentMonthFirst(), 'YYYY-MM-DD'),
              moment(new Date(), 'YYYY-MM-DD'),
            ],
            productId: '',
          }}
        >
          <Form.Item label="产品" name="productId">
            <Select style={{width: '160px'}}>
              <Select.Option value="">全部</Select.Option>
              {productList.map((v, i) => (
                <Select.Option key={i} value={v.id}>
                  {v.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="借据号" name="orderNum">
            <Input placeholder="请输入借据号" style={{width: 130}} />
          </Form.Item>
          <Form.Item label="流水号" name="bankOrderNum">
            <Input placeholder="请输入流水号" style={{width: 130}} />
          </Form.Item>
          <Form.Item label="发生日期" name="time">
            <RangePicker />
          </Form.Item>

          <Button type="primary" style={{marginRight: 15}} htmlType="submit">
            查询
          </Button>
          <Button style={{marginRight: 15}} onClick={onReset}>
            重置
          </Button>
        </Form>

        <TableList
          {...{
            list,
            onPage,
            pageParams,
            productList,
            totalNum,
            totalData,
            accountList,
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
