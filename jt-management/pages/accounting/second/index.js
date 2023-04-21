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
  {text: 'Ⅱ类户交易流水'},
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
    }
    fetchData()
  }, [])
  const fetchIncometList = async (values = {}) => {
    try {
      const {time} = values
      if (Array.isArray(time)) {
        values = {
          ...values,
          createTimeBegin: moment(time[0]).format('YYYY-MM-DD'),
          createTimeEnd: moment(time[1]).format('YYYY-MM-DD'),
        }
      }
      delete values.time
      const {
        data: {data, code},
      } = await apiAccounting.fetch_tradeList_list({...pageParams, ...values})
      if (code == 0) {
        setTotalNum(data.totalAmount)
        setList(data.page.list)
        setTotalData(data.page)
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
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Form
          form={form}
          onFinish={onSearch}
          layout="inline"
          className="searchForm"
          initialValues={{
            tradeType: '',
          }}
        >
          {/* <Form.Item label="交易类型" name="tradeType">
            <Select style={{width: '160px'}}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value={1}>转入</Select.Option>
              <Select.Option value={2}>转出</Select.Option>
              <Select.Option value={3}>还款</Select.Option>
              <Select.Option value={4}>放款</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="交易流水号" name="tradeNo">
            <Input placeholder="请输入交易流水号" style={{width: 150}} />
          </Form.Item>
          <Form.Item label="三方流水号" name="payOrderNo">
            <Input placeholder="请输入三方流水号" style={{width: 150}} />
          </Form.Item>
          <Form.Item label="交易账号" name="accountNo">
            <Input placeholder="请输入交易账号" style={{width: 150}} />
          </Form.Item>
          <Form.Item label="发生日期" name="time">
            <RangePicker />
          </Form.Item> */}
          <Form.Item label="客户名称" name="userName">
            <Input placeholder="请输入客户名称" style={{width: 200}} />
          </Form.Item>
          <Form.Item label="Ⅱ类户账号" name="accountNo">
            <Input placeholder="请输入Ⅱ类户账号" style={{width: 200}} />
          </Form.Item>
          <Form.Item label="证件号码" name="idCard">
            <Input placeholder="请输入证件号码" style={{width: 200}} />
          </Form.Item>
          <Form.Item label="手机号" name="userPhone">
            <Input placeholder="请输入手机号" style={{width: 150}} />
          </Form.Item>
          <Form.Item label="开户日期" name="time">
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
            totalNum,
            totalData,
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
