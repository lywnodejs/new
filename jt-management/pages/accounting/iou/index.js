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
  {text: '借据查询'},
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
  const [totalData, setTotalData] = useState([])
  const [statusList, setStatusList] = useState([])
  const [typeInit, setTypeInit] = useState([])

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
      fetchStatus()
    }
    fetchData()
  }, [])
  const fetchIncometList = async (values = {}) => {
    try {
      if (values.time == undefined) {
        values = {
          ...values,
          grantFinishTimeStart: moment(getCurrentMonthFirst()).format(
            'YYYY-MM-DD',
          ),
          grantFinishTimeEnd: moment(new Date()).format('YYYY-MM-DD'),
        }
      }
      if (values.time === null) {
        values = {
          ...values,
          grantFinishTimeStart: null,
          grantFinishTimeEnd: null,
        }
      }
      if (values.orderNum === undefined || values.orderNum === '') {
        delete values.orderNum
        values = {
          ...values,
        }
      }
      if (typeInit == 0 && values.time && values.time.length > 0) {
        values = {
          ...values,
          grantFinishTimeStart: moment(values.time[0]).format('YYYY-MM-DD'),
          grantFinishTimeEnd: moment(values.time[1]).format('YYYY-MM-DD'),
        }
      } else {
        values = {
          ...values,
        }
      }
      if (typeInit == 1 && values.time && values.time.length > 0) {
        values = {
          ...values,
          repayFinishTimeStart: moment(values.time[0]).format('YYYY-MM-DD'),
          repayFinishTimeEnd: moment(values.time[1]).format('YYYY-MM-DD'),
        }
      } else {
        values = {
          ...values,
        }
      }
      delete values.time
      delete values.dateType
      const {
        data: {data, code},
      } = await apiAccounting.fetch_receipt_list({...pageParams, ...values})
      if (code == 0) {
        setTotalData(data)
        setList(data.list)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const fetchStatus = async () => {
    try {
      const {
        data: {data, code},
      } = await apiAccounting.get_data_dict('RECEIPT_STATUS')
      if (code == 0) {
        setStatusList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onSearch = async (value) => {
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

  const changeDateType = (val) => {
    setTypeInit(val == 0 ? 0 : 1)
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
            status: null,
            dateType: 0,
            time: [
              moment(getCurrentMonthFirst(), 'YYYY-MM-DD'),
              moment(new Date(), 'YYYY-MM-DD'),
            ],
          }}
        >
          <Form.Item label="借据状态" name="status">
            <Select style={{width: '160px'}}>
              <Select.Option value={null}>全部</Select.Option>
              {statusList.map((v, i) => (
                <Select.Option key={i} value={v.code}>
                  {v.description}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="产品" name="productId">
            <Select style={{width: '160px'}}>
              <Select.Option value={null}>全部</Select.Option>
              {productList.map((v, i) => (
                <Select.Option key={i} value={v.id}>
                  {v.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="借据号" name="orderNum">
            <Input placeholder="请输入借据号" style={{width: 130}} allowClear />
          </Form.Item>
          <Form.Item label="借款人" name="realName">
            <Input placeholder="请输入借款人" style={{width: 120}} allowClear />
          </Form.Item>
          <Form.Item name="dateType">
            <Select style={{width: '130px'}} onChange={changeDateType}>
              <Select.Option value={0}>放款日</Select.Option>
              <Select.Option value={1}>到期日</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="日期选择" name="time">
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
            totalData,
            onPage,
            pageParams,
            productList,
            statusList,
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
