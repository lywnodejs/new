import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, DatePicker, Form, Select, Input, Button} from 'antd'
import TableList from './TableList'
import apiAccounting from '~/api/accounting'
import moment from 'moment'
const {RangePicker} = DatePicker
const breadcrumbs = [{text: '财务核算'}, {text: '对账管理'}, {text: '月利润表'}]
const pageParams = {
  pageNum: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [list, setList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [form] = Form.useForm()
  useEffect(() => {
    fetchProfitList()
  }, [])
  const fetchProfitList = async (values = {}) => {
    try {
      const {time} = values
      if (Array.isArray(time)) {
        values = {
          ...values,
          startTime: moment(time[0]).format('YYYY-MM'),
          endTime: moment(time[1]).format('YYYY-MM'),
        }
      } else if (time === undefined) {
        values = {
          ...values,
          startTime: moment(getFirstMonth()).format('YYYY-MM'),
          endTime: moment(new Date()).format('YYYY-MM'),
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
      } = await apiAccounting.fetch_profitMonthly_list({
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

  const getFirstMonth = () => {
    var thisYear = new Date().getFullYear()
    var start = new Date('1/1/' + thisYear)
    return start
  }

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNum = 1
    fetchProfitList({...values})
  }
  const onReset = () => {
    form.resetFields()
    onSearch({})
  }
  const onPage = async () => {
    fetchProfitList(values)
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
              moment(getFirstMonth(), 'YYYY-MM'),
              moment(new Date(), 'YYYY-MM'),
            ],
          }}
        >
          <Form.Item label="核算周期" name="time">
            <RangePicker picker="month" />
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
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
