import {Layout} from '~/components/Layout'
import React, {useEffect, useState, useContext} from 'react'
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
import apiReview from '~/api/review'
import apiProduct from '~/api/product'
import {useCookies} from 'react-cookie'
import moment from 'moment'
import {DownOutlined, UpOutlined} from '@ant-design/icons'
import Router from 'next/router'
import {withKeepAlive} from 'react-next-keep-alive'

const {RangePicker} = DatePicker
const breadcrumbs = [{text: '信审管理'}, {text: '信审列表'}]
const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [isCollapse, setIsCollapse] = useState(false)
  const [list, setList] = useState([])
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [totalData, setTotalData] = useState([])

  const [form] = Form.useForm()
  useEffect(() => {
    async function fetchData() {
      pageParams.pageNo = 1
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
      fetchCreditList()
    }
    fetchData()
    console.log(props.keyword, '===')
  }, [])

  const fetchCreditList = async (values = {}) => {
    try {
      const {time, times} = values
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
      if (times && times.length > 0) {
        values = {
          ...values,
          updateTimeStart: moment(times[0]).format('YYYY-MM-DD'),
          updateTimeEnd: moment(times[1]).format('YYYY-MM-DD'),
        }
      } else {
        values = {
          ...values,
        }
      }
      delete values.time
      delete values.times
      const postData = props.keyword ? {keyword: props.keyword} : {...values}
      const {
        data: {data, code},
      } = await apiReview.fetch_creditOrder_list({...pageParams, ...postData})
      if (code == 0) {
        setList(data.list)
        setTotalData(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNo = 1
    fetchCreditList({...values})
  }
  const onReset = () => {
    form.resetFields()
    onSearch({})
  }
  const onPage = async () => {
    fetchCreditList(values)
  }

  const vertifyStatusList = [
    {code: '10', description: '待分配'},
    {code: '20', description: '初审中'},
    {code: '29', description: '初审完成'},
    {code: '40', description: '复核中'},
    {code: '49', description: '复核完成'},
    {code: '30', description: '终审中'},
    {code: '39', description: '终审完成'},
    {code: '99', description: '人工拒绝'},
    {code: '100', description: '人工通过'},
  ]

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      extra={
        props.keyword ? (
          <Button
            onClick={() => {
              Router.back()
            }}
          >
            返回上一页
          </Button>
        ) : null
      }
    >
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Form
          form={form}
          onFinish={onSearch}
          layout="inline"
          className="searchForm"
          initialValues={{
            status: null,
            name: null,
            verifyStatus: null,
            productType: null,
            time: [],
            times: [],
          }}
        >
          <Row>
            <Form.Item label="信审单号/订单号/手机号" name="keyword">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="用户名" name="name">
              <Input placeholder="请输入" />
            </Form.Item>

            <Form.Item
              label="审核状态"
              name="verifyStatus"
              style={{marginLeft: 40}}
            >
              <Select style={{width: 160}}>
                <Select.Option value={null}>全部</Select.Option>
                {vertifyStatusList.map((v, i) => (
                  <Select.Option key={i} value={v.code}>
                    {v.description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <span style={{marginLeft: 40}}>
              <Button
                type="primary"
                style={{marginRight: 15}}
                htmlType="submit"
              >
                查询
              </Button>
              <Button style={{marginRight: 15}} onClick={onReset}>
                重置
              </Button>
              <a style={{marginTop: 5}}>
                {!isCollapse ? (
                  <span onClick={() => setIsCollapse(true)}>
                    展开 <DownOutlined />
                  </span>
                ) : (
                  <span onClick={() => setIsCollapse(false)}>
                    收起&nbsp;
                    <UpOutlined />
                  </span>
                )}
              </a>
            </span>
          </Row>
          {isCollapse ? (
            <Row>
              <Form.Item label="产品名" name="productType">
                <Select style={{width: '160px'}}>
                  <Select.Option value={null}>全部</Select.Option>
                  {productList.map((v, i) => (
                    <Select.Option key={i} value={v.id}>
                      {v.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="授信日期" name="time">
                <RangePicker />
              </Form.Item>
              <Form.Item label="更新日期" name="times">
                <RangePicker />
              </Form.Item>
            </Row>
          ) : null}
        </Form>

        <TableList
          {...{
            list,
            onPage,
            pageParams,
            productList,
            totalData,
            vertifyStatusList,
          }}
        />
      </Space>
    </Layout>
  )
}

export default withKeepAlive(body, 'credit-list')
