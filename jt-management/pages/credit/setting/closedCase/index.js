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
  {text: '已结案订单统计'},
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
      fetchStatFinish()
    }
    fetchData()
  }, [])

  const fetchStatFinish = async (values = {}) => {
    try {
      const {time, overTime} = values

      if (time && time.length > 0) {
        values = {
          ...values,
          orderTimeStart: moment(time[0]).format('YYYY-MM-DD'),
          orderTimeEnd: moment(time[1]).format('YYYY-MM-DD'),
        }
      } else {
        values = {
          ...values,
        }
      }
      if (overTime && overTime.length > 0) {
        values = {
          ...values,
          creditVerifyFinishTimeStart: moment(overTime[0]).format('YYYY-MM-DD'),
          creditVerifyFinishTimeEnd: moment(overTime[1]).format('YYYY-MM-DD'),
        }
      } else {
        values = {
          ...values,
        }
      }
      delete values.time
      delete values.overTime
      const {
        data: {data, code},
      } = await apiReview.fetch_report_finish({
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
    fetchStatFinish(values)
  }

  const onReset = () => {
    form.resetFields()
    onSearch({})
  }

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNo = 1
    fetchStatFinish({...values})
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
            overTime: [],
            time: [],
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
            <Form.Item label="初审完成时间" name="time">
              <RangePicker />
            </Form.Item>
            <Form.Item label="信审结案时间" name="overTime">
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
