import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, DatePicker, Form, Select, Input, Button} from 'antd'
import TableList from './TableList'
import apiAccounting from '~/api/accounting'
import moment from 'moment'

const {RangePicker} = DatePicker
const breadcrumbs = [
  {text: '财务核算'},
  {text: '成本核算'},
  {text: '成本明细'},
  {text: '资金成本'},
]
const pageParams = {
  pageNum: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [list, setList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [accountList, setAccountList] = useState([])
  const [form] = Form.useForm()
  useEffect(() => {
    fetchRecordList()
    fetchAccount()
  }, [])
  const fetchRecordList = async (values = {}) => {
    try {
      const {time} = values
      if (Array.isArray(time)) {
        values = {
          ...values,
          startTime: moment(time[0]).format('YYYY-MM-DD'),
          endTime: moment(time[1]).format('YYYY-MM-DD'),
        }
      } else if (time === undefined) {
        values = {
          ...values,
          startTime: moment(getCurrentMonthFirst()).format('YYYY-MM-DD'),
          endTime: moment(new Date()).format('YYYY-MM-DD'),
        }
      } else if (time === null) {
        values = {
          ...values,
          startTime: null,
          endTime: null,
        }
      }
      delete values.time
      const {
        data: {data, code},
      } = await apiAccounting.fetch_record_list({...pageParams, ...values})
      if (code == 0) {
        setTotalData(data)
        setList(data.list)
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
    pageParams.pageNum = 1
    fetchRecordList({...values})
  }
  const onReset = () => {
    form.resetFields()
    onSearch({})
  }
  const onPage = async () => {
    fetchRecordList(values)
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
            status: '',
          }}
        >
          <Form.Item label="开始日期" name="time">
            <RangePicker />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select style={{width: '160px'}}>
              <Select.Option value="">全部</Select.Option>
              <Select.Option value={1}>占用中</Select.Option>
              <Select.Option value={2}>已结束</Select.Option>
            </Select>
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
            totalData,
            onPage,
            pageParams,
            fetchRecordList,
            accountList,
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
