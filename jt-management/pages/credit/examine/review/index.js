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
import MemoForm from '~/components/common/memoForm'

const {RangePicker} = DatePicker

const breadcrumbs = [{text: '信审管理'}, {text: '审核列表'}, {text: '复核操作'}]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}
function body({props}) {
  const [isCollapse, setIsCollapse] = useState(false)
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [list, setList] = useState([])
  const [channelData, setChannelData] = useState([])
  const [memoVisible, setMemoVisible] = useState(false)
  const [selectItem, setSelectItem] = useState({})
  const [form] = Form.useForm()
  const [users, setUsers] = useState([])

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
        assign: 2,
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

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNo = 1
    fetchVerfyOrderList({...values})
  }

  const onPage = async () => {
    fetchVerfyOrderList(values)
  }

  const onEditMemo = (item) => {
    setMemoVisible(true)
    setSelectItem(item)
  }

  const onAddRemark = async (memoForm, selectItem) => {
    try {
      const values = await memoForm.validateFields()
      const {data} = await apiReview.fetch_creditRemark_update({
        note: values.note,
        id: selectItem.id,
      })

      if (data.code == 0) {
        setMemoVisible(false)
        message.success('保存成功')
        memoForm.resetFields()
        fetchVerfyOrderList()
      }
    } catch (errorInfo) {
      console.error('Failed:', errorInfo)
    }
  }

  const changeHID = async (selectItem) => {
    try {
      const {data} = await apiReview.fetch_creditBlue_update({
        id: selectItem.id,
        isBlue: selectItem.isBlue ? 0 : 1,
      })
      if (data.code == 0) {
        message.success('修改成功')
        fetchVerfyOrderList()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const onReset = () => {
    form.resetFields()
    onSearch({})
  }

  const userTreesList = async () => {
    try {
      const {
        data: {data, code},
      } = await apiReview.fetch_userTrees_list()
      if (code == 0) {
        console.log(data)
        setUsers(data)
      }
    } catch (error) {
      console.log(error)
    }
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
            productType: null,
            time: [],
            operatorName: null,
          }}
        >
          <Row>
            <Form.Item label="手机号\信审单号" name="keyword">
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
            <Form.Item label="用户名" name="name">
              <Input placeholder="请输入" />
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
              <Form.Item label="授信日期" name="time">
                <RangePicker />
              </Form.Item>
              <Form.Item label="信审员名" name="operatorName">
                <Select style={{width: 180}}>
                  <Select.Option value={null}>全部</Select.Option>
                  {users.map((v, i) => (
                    <Select.Option key={i} value={v.accountName}>
                      {v.accountName}
                    </Select.Option>
                  ))}
                </Select>
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
            onEditMemo,
            changeHID,
          }}
        />

        <MemoForm
          visible={memoVisible}
          onHide={() => setMemoVisible(false)}
          selectItem={selectItem}
          onSubmit={onAddRemark}
        />
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
