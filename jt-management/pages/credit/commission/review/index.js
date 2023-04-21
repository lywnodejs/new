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
import {DownOutlined, UpOutlined} from '@ant-design/icons'
import apiReview from '~/api/review'
import SelectDistributionModal from '~/components/common/SelectDistributionModal'
import QuantityDistributionModal from '~/components/common/QuantityDistributionModal'
const {RangePicker} = DatePicker
const breadcrumbs = [{text: '信审管理'}, {text: '委案列表'}, {text: '复核委案'}]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}

function body({props}) {
  const [isCollapse, setIsCollapse] = useState(false)
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [form] = Form.useForm()
  const [list, setList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [channelData, setChannelData] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectData, setSelectData] = useState([])
  const [total, setTotal] = useState(0)
  const [accordingVisible, setAccordingVisible] = useState(false)

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
      fetchVerfyOrderList()
      channelList()
      userTreesList()
    }
    fetchData()
  }, [])

  const fetchVerfyOrderList = async (values = {}) => {
    try {
      const {time} = values
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
      delete values.time
      const {
        data: {data, code},
      } = await apiReview.fetch_credit_verifyOrder({
        ...pageParams,
        ...values,
        verifyStatus: 40,
        assign: 1,
      })
      if (code == 0) {
        setList(data.list)
        setTotalData(data)
      }
    } catch (err) {
      console.log(err)
    }
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

  const userTreesList = async () => {
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_userTrees_list()
      if (code == 0) {
        console.log(data)
        setSelectData(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onPage = async () => {
    fetchVerfyOrderList(values)
  }

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNo = 1
    fetchVerfyOrderList({...values})
  }

  const chooseDistribution = () => {
    if (!selectedRowKeys.length) {
      return message.error('请先选择要分配的订单')
    }
    setVisible(true)
  }

  const onSearchTotal = async (values) => {
    try {
      values.beginCreateTime = null
      values.endCreateTime = null

      values.beginGrantTime = null
      values.endGrantTime = null

      const {
        data: {data, code},
      } = await apiReview.fetch_overdueAlloc_list({
        ...values,
        page: 1,
        pageSize: 10000,
        tenantId: cookies.tenantId,
      })
      if (code === 0) {
        setTotal(data.total)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const chooseAccordingVisible = () => {
    setAccordingVisible(true)
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
            name: null,
            keyword: null,
            dateType: null,
          }}
        >
          <Row>
            <Form.Item label="信审单号/手机号" name="keyword">
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item label="用户名" name="name">
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
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 15}} onClick={onReset}>
              重置
            </Button>
            <Button
              style={{marginLeft: 15}}
              type="primary"
              onClick={chooseDistribution}
            >
              选择分配
            </Button>
            <Button
              style={{marginLeft: 15}}
              type="primary"
              onClick={chooseAccordingVisible}
            >
              按量分配
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
              <Form.Item label="授信日期" name="time">
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
            channelData,
            productList,
            selectedRowKeys,
            setSelectedRowKeys,
          }}
        />

        <SelectDistributionModal
          orderIds={selectedRowKeys}
          visible={visible}
          onHide={() => setVisible(false)}
          selectData={selectData}
          assignType={1}
          verifyStatus={40}
        />

        <QuantityDistributionModal
          onSearch={onSearchTotal}
          total={total}
          visible={accordingVisible}
          onHide={() => setAccordingVisible(false)}
          tenantId={cookies.tenantId}
          productList={productList}
          selectData={selectData}
          assignType={2}
          verifyStatus={40}
        />
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
