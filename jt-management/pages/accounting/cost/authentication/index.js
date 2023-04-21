import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, DatePicker, Form, Select, Input, Button} from 'antd'
import TableList from './TableList'
import apiAccounting from '~/api/accounting'
import moment from 'moment'
import apiMechanism from '~/api/mechanism'
const {RangePicker} = DatePicker

const breadcrumbs = [
  {text: '财务核算'},
  {text: '成本核算'},
  {text: '成本明细'},
  {text: '银行卡鉴权成本'},
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
  const [businessList, setBusinessList] = useState([])

  useEffect(() => {
    fetchAuthCost()
    fetchAssets()
  }, [])
  const fetchAuthCost = async (values = {}) => {
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
      } = await apiAccounting.fetch_cardAuthCost_list({
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
  const fetchAssets = async () => {
    try {
      const {
        data: {data, code},
      } = await apiMechanism.get_mechanism_list({...values})
      if (code == 0) {
        setBusinessList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNum = 1
    fetchAuthCost({...values})
  }
  const onReset = () => {
    form.resetFields()
    onSearch({})
  }
  const onPage = async () => {
    fetchAuthCost(values)
  }
  const getCurrentMonthFirst = () => {
    var date = new Date()
    date.setDate(1)
    return date
  }

  const newBusinessList = businessList.filter((item) => {
    return item.type == '支付通道'
  })
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
            channelId: null,
          }}
        >
          <Form.Item label="日期" name="time">
            <RangePicker />
          </Form.Item>
          <Form.Item label="商家名称" name="channelId">
            <Select style={{width: 150}}>
              <Select.Option value={null}>全部</Select.Option>
              {newBusinessList.map((v, i) => (
                <Select.Option key={i} value={v.id}>
                  {v.name}
                </Select.Option>
              ))}
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
            newBusinessList,
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
