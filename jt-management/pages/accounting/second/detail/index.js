import {Layout} from '~/components/Layout'
import React, {useEffect, useState, useContext} from 'react'
import {Form, Card, Button, Select, Space, Input, DatePicker} from 'antd'
import moment from 'moment'
import Router, {useRouter, withRouter} from 'next/router'
import _ from 'lodash'
import TableList from './TableList'
import apiAccounting from '~/api/accounting'

const {RangePicker} = DatePicker
let values = {}
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const breadcrumbs = [
  {text: '财务核算'},
  {text: '业务数据查询'},
  {text: '交易流水详情'},
]
function body(props) {
  const [form] = Form.useForm()
  const [data, setData] = useState({})
  const [accountList, setAccountList] = useState([])

  useEffect(() => {
    getList()
    fetchAccount()
  }, [])

  const getList = async () => {
    try {
      const {time} = values
      if (Array.isArray(time) && time.length === 2) {
        values = {
          ...values,
          payTimeStart: moment(time[0]).format('YYYY-MM-DD'),
          payTimeEnd: moment(time[1]).format('YYYY-MM-DD'),
        }
      }
      delete values.time
      const {
        data: {data, code},
      } = await apiAccounting.fetch_loanList_list({
        ...pageParams,
        ...values,
        accountNo: props.accountNo,
      })
      if (code == 0) {
        setData(data.page)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNo = 1
    getList({...values})
  }
  const onReset = () => {
    form.resetFields()
    onSearch({})
  }
  const onPage = (pageNo, pageSize) => {
    pageParams.pageNo = pageNo
    pageParams.pageSize = pageSize
    getList(values)
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
  return (
    <Layout
      isGray={true}
      breadcrumbs={breadcrumbs}
      extra={<Button onClick={() => Router.back()}>返回上一页</Button>}
    >
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Form
          form={form}
          onFinish={onSearch}
          layout="inline"
          className="searchForm"
          initialValues={{
            time: [],
            tradeType: '',
          }}
        >
          <Form.Item label="交易类型" name="tradeType">
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
            data,
            onPage,
            pageParams,
            accountList,
          }}
        />
      </Space>
    </Layout>
  )
}

export default withRouter(body)
