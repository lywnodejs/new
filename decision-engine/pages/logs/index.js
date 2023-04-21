import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {message, Form, Tabs, Input, Button, Select, DatePicker} from 'antd'
import {useCookies} from 'react-cookie'
import apiProduct from '~/api/product'
import api from '~/api/risk'
import TableList from './TableList'
import moment from 'moment'
const {RangePicker} = DatePicker

const {TabPane} = Tabs
const breadcrumbs = [{text: '系统管理'}, {text: '规则操作日志'}]

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
let values = {}

function body(props) {
  const [cookies] = useCookies(['tenantId'])
  const [activeKey, setActiveKey] = useState('-1')
  const [activeModuleKey, setActiveModuleKey] = useState('-1')
  const [productList, setProductList] = useState([])
  const [list, setList] = useState([])
  const [form] = Form.useForm()
  useEffect(() => {
    function fetchData() {
      fetchProductList()
    }
    fetchData()
  }, [])

  useEffect(() => {
    function fetchData() {
      if (activeKey != -1) {
        values = {}
        pageParams.pageNo = 1
        onPage()
      }
    }
    fetchData()
  }, [activeKey, activeModuleKey])
  const dateTime = (date) => {
    var strYear = date.getFullYear() - 1
    var strDay = date.getDate()
    var strMonth = date.getMonth() + 1
    if (strMonth < 10) {
      strMonth = '0' + strMonth
    }
    if (strDay < 10) {
      strDay = '0' + strDay
    }
    let datastr = strYear + '-' + strMonth + '-' + strDay
    return datastr
  }
  const fetchList = async (values = {}) => {
    const {time} = values
    values.beginTime =
      (time && moment(time[0]).format('YYYY-MM-DD')) || dateTime(new Date())
    values.endTime =
      (time && moment(time[1]).format('YYYY-MM-DD')) ||
      moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
    delete values.time
    values.operatorType = values.operatorType || null

    let postData = {
      ...pageParams,
      ...values,
      sortType: 'DESC',
      moduleType: activeModuleKey,
      productId: activeKey,
    }
    try {
      const {
        data: {data, code},
      } = await api.fetch_risk_logs(postData)
      if (code == 0) {
        setList(data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchProductList = async () => {
    try {
      const {
        data: {data, code},
      } = await apiProduct.get_products()
      if (code == 0) {
        setProductList(data)
        data && data.length && setActiveKey(String(data[0].produceId))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const changeTab = async (key) => {
    setActiveKey(key)
  }

  const onSearch = async (value) => {
    values = value
    pageParams.pageNo = 1
    fetchList({...values})
  }

  const onPage = async () => {
    fetchList(values)
  }
  const changeOperatorType = async (val) => {
    // form.setFieldsValue('operatorType', val)
    console.log(await form.getFieldValue())
  }

  const onReset = () => {
    form.resetFields()
  }
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className="searchForm" style={{marginBottom: '10px'}}>
        <Tabs activeKey={activeKey} onTabClick={(key) => changeTab(key, false)}>
          {productList && productList.length
            ? productList.map((item) => (
                <TabPane
                  tab={item.productName}
                  key={item.produceId}
                  forceRender={true}
                ></TabPane>
              ))
            : null}
        </Tabs>
        <Form
          form={form}
          onFinish={(values) =>
            onSearch({
              ...values,
            })
          }
          layout="inline"
          initialValues={{
            actionType: '',
            operatorType: '',
            stage: '',
          }}
        >
          <Form.Item label="选择日期" name="time">
            <RangePicker />
          </Form.Item>
          <Form.Item label="规则编号" name="ruleCode">
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="修改类型" name="operatorType">
            <Select
              style={{width: '160px'}}
              onChange={(val) => changeOperatorType(val)}
            >
              <Select.Option value="">全部</Select.Option>
              <Select.Option value="2">修改</Select.Option>
              <Select.Option value="1">新增</Select.Option>
              <Select.Option value="4">启用/禁用</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" style={{marginRight: 15}} htmlType="submit">
            查询
          </Button>

          <Button style={{marginRight: 15}} onClick={onReset}>
            重置
          </Button>
        </Form>
      </div>
      <TableList
        {...{
          list,
          onPage,
          pageParams,
        }}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {}
}

export default body
