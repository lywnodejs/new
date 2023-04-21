import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, DatePicker, Form, Select, Input, Button} from 'antd'
import TableList from './TableList'
import apiAccounting from '~/api/accounting'
import moment from 'moment'
const {RangePicker} = DatePicker
const breadcrumbs = [{text: '财务核算'}, {text: '成本核算'}, {text: '手工核算'}]
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
    fetchCostMothlyList()
  }, [])
  const fetchCostMothlyList = async (values = {}) => {
    const {time} = values
    try {
      if (time != null && time != undefined) {
        values = {
          ...values,
          statDate: moment(time).format('YYYY-MM'),
        }
      } else if (time === undefined) {
        values = {
          ...values,
          statDate: moment(getCurrentMonthFirst()).format('YYYY-MM'),
        }
      } else if (time === null) {
        values = {
          ...values,
          statDate: null,
        }
      }
      delete values.time
      const {
        data: {data, code},
      } = await apiAccounting.fetch_costMonthly_list({
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

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNum = 1
    fetchCostMothlyList({...values})
  }
  const onReset = () => {
    form.resetFields()
    onSearch({})
  }
  const onPage = async () => {
    fetchCostMothlyList(values)
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
            time: moment(getCurrentMonthFirst(), 'YYYY-MM'),
          }}
        >
          <Form.Item label="核算周期" name="time">
            <DatePicker picker="month" />
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
            fetchCostMothlyList,
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
