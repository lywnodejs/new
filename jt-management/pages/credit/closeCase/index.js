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
import apiReview from '~/api/review'
import moment from 'moment'
import {DownOutlined, UpOutlined} from '@ant-design/icons'
const {RangePicker} = DatePicker

const breadcrumbs = [{text: '信审管理'}, {text: '结案列表'}]

const vertifyStatusList = [
  {code: '99', description: '人工拒绝'},
  {code: '100', description: '人工通过'},
]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}
function body({router}) {
  const [isCollapse, setIsCollapse] = useState(false)
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [form] = Form.useForm()
  const [list, setList] = useState([])
  const [channelData, setChannelData] = useState([])

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
    fetcCloseCase()
    channelList()
    fetchData()
  }, [])

  const fetcCloseCase = async (values = {}) => {
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
          finisTimeStart: moment(overTime[0]).format('YYYY-MM-DD'),
          finisTimeEnd: moment(overTime[1]).format('YYYY-MM-DD'),
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
      } = await apiReview.fetch_over_case({
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

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNo = 1
    fetcCloseCase({...values})
  }

  const onPage = async () => {
    fetcCloseCase(values)
  }

  const channelList = async () => {
    try {
      const {
        data: {data, code},
      } = await apiReview.get_data_dict('LOAN_APPLY_SOURCE')
      if (code == 0) {
        setChannelData(data)
      }
    } catch (error) {
      console.log(error)
    }
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
            productType: null,
            keyword: null,
            dateType: null,
            verifyStatus: null,
            time: [],
            overTime: [],
          }}
        >
          <Row>
            <Form.Item label="手机号" name="keyword">
              <Input placeholder="请输入" />
            </Form.Item>
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

            <Form.Item label="审核状态" name="verifyStatus">
              <Select style={{width: '130px'}}>
                <Select.Option value={null}>全部</Select.Option>
                {vertifyStatusList.map((v, i) => (
                  <Select.Option key={i} value={v.code}>
                    {v.description}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 15}} onClick={onReset}>
              重置
            </Button>
            <a style={{marginTop: 5, marginLeft: 10}}>
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
          </Row>
          {isCollapse ? (
            <Row style={{width: 1000}}>
              <Form.Item label="用户名" name="name">
                <Input />
              </Form.Item>
              <Form.Item label="授信日期" name="time">
                <RangePicker />
              </Form.Item>
              <Form.Item label="结案日期" name="overTime">
                <RangePicker />
              </Form.Item>
            </Row>
          ) : null}
        </Form>

        <TableList
          {...{
            list,
            totalData,
            onPage,
            pageParams,
            productList,
            channelData,
            vertifyStatusList,
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
