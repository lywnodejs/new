import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, DatePicker, Form, Select, Input, Button} from 'antd'
import TableList from './TableList'
import apiAccounting from '~/api/accounting'
import apiProduct from '~/api/product'
import moment from 'moment'
import {useCookies} from 'react-cookie'
const {RangePicker} = DatePicker
const breadcrumbs = [{text: '担保业务管理 '}, {text: '担保报表'}]
const pageParams = {
  pageNum: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [list, setList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [form] = Form.useForm()
  const [productList, setProductList] = useState([])
  useEffect(() => {
    fetchCostList()
    getproductList()
  }, [])

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
  const fetchCostList = async (values = {}) => {
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
          startTime: moment(getCurrentMonthFirst(), 'YYYY-MM-DD').format(
            'YYYY-MM-DD',
          ),
          endTime: moment(
            new Date(new Date().setDate(new Date().getDate())),
          ).format('YYYY-MM-DD'),
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
      } = await apiAccounting.fetch_cost_list({...pageParams, ...values})
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
    fetchCostList({...values})
  }
  const onReset = () => {
    form.resetFields()
    onSearch({})
  }
  const onPage = async () => {
    fetchCostList(values)
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
              moment(
                new Date(new Date().setDate(new Date().getDate())),
                'YYYY-MM-DD',
              ),
            ],
            productId: null,
          }}
        >
          <Form.Item label="放款日期" name="time">
            <RangePicker />
          </Form.Item>

          <Form.Item label="产品" name="productId">
            <Select style={{width: '160px'}}>
              <Select.Option value={null}>全部</Select.Option>
              {productList.map((v, i) => (
                <Select.Option key={i} value={v.id}>
                  {v.name}
                </Select.Option>
              ))}
              <Select.Option value={-1}>其它</Select.Option>
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
            productList,
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
