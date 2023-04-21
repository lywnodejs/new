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
} from 'antd'
import TableList from './TableList'
import apiProduct from '~/api/product'
import {useCookies} from 'react-cookie'
import moment from 'moment'
import apiReview from '~/api/review'

const {RangePicker} = DatePicker

const breadcrumbs = [
  {text: '信审管理'},
  {text: '报表统计'},
  {text: '处理中订单统计'},
]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}
function body({router}) {
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [list, setList] = useState([])
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
      fetchStatVerifying()
    }
    fetchData()
  }, [])

  const fetchStatVerifying = async (values = {}) => {
    try {
      const {time} = values
      if (Array.isArray(time)) {
        values = {
          ...values,
          orderTimeStart: moment(time[0]).format('YYYY-MM-DD'),
          orderTimeEnd: moment(time[1]).format('YYYY-MM-DD'),
        }
      } else if (time === null) {
        values = {
          ...values,
          orderTimeStart: null,
          orderTimeEnd: null,
        }
      }
      delete values.time
      const {
        data: {data, code},
      } = await apiReview.fetch_report_processing({
        ...pageParams,
        ...values,
      })
      if (code == 0) {
        setList(data.list)
        setTotalData(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onPage = async () => {
    fetchStatVerifying(values)
  }

  const onReset = () => {
    form.resetFields()
    onSearch({})
  }

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNo = 1
    fetchStatVerifying({...values})
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
            productType: null,
            tiem: [],
          }}
        >
          <Row>
            <Form.Item label="产品名" name="productType">
              <Select style={{width: 180}}>
                <Select.Option value={null}>全部</Select.Option>
                {productList.map((v, i) => (
                  <Select.Option key={i} value={v.id}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="订单日期" name="time">
              <RangePicker />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 15}} onClick={onReset}>
              重置
            </Button>
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

body.getInitialProps = async () => {
  return {}
}

export default body
