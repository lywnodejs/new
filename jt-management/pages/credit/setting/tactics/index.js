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
import apiReview from '~/api/review'
import {useCookies} from 'react-cookie'
import moment from 'moment'
import {get, post, request} from '~/utils/fetch'

const {RangePicker} = DatePicker
const breadcrumbs = [
  {text: '信审管理'},
  {text: '报表统计'},
  {text: '绩效考核报表'},
]

const pageParams = {
  pageNum: 1,
  pageSize: 10,
}
let values = {}
function body({router}) {
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [list, setList] = useState([])
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
    }
    fetchStatAssessList()
    fetchData()
  }, [])

  const fetchStatAssessList = async (values = {}) => {
    const {time} = values
    try {
      if (time != null && time != undefined) {
        values = {
          ...values,
          loanDate: moment(time).format('YYYY-MM'),
        }
      } else if (time === undefined) {
        values = {
          ...values,
          loanDate: moment(getCurrentMonthFirst()).format('YYYY-MM'),
        }
      } else if (time === null) {
        values = {
          ...values,
          loanDate: null,
        }
      }
      delete values.time
      const {
        data: {data, code},
      } = await apiReview.fetch_credit_statAssess({
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
    fetchStatAssessList(values)
  }

  const getCurrentMonthFirst = () => {
    var date = new Date()
    date.setDate(1)
    return date
  }

  const exportData = async () => {
    const values = await form.validateFields()
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_assess_update({
        ...pageParams,
        loanDate:
          values.time == null ? null : moment(values.time).format('YYYY-MM'),
        isExport: 1,
      })
      if (code == 0) {
        window.open(data)
        message.success('导出成功')
      }
    } catch (err) {
      console.log(err)
    }
  }
  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNum = 1
    fetchStatAssessList({...values})
  }

  const onReset = () => {
    form.resetFields()
    onSearch({})
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
            productId: null,
          }}
        >
          <Row>
            <Form.Item label="产品名" name="productId">
              <Select style={{width: 180}}>
                <Select.Option value={null}>全部</Select.Option>
                {productList.map((v, i) => (
                  <Select.Option key={i} value={v.id}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="放款月份" name="time">
              <DatePicker picker="month" />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 15}} onClick={onReset}>
              重置
            </Button>
            <Button
              style={{marginLeft: 15}}
              type="primary"
              onClick={exportData}
            >
              导出
            </Button>
          </Row>
        </Form>
        <TableList
          {...{
            list,
            pageParams,
            onPage,
            totalData,
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
