import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import {Space, message, DatePicker, Form, Select, Input, Button} from 'antd'
import TableList from './TableList'
import apiAccounting from '~/api/accounting'
import apiProduct from '~/api/product'
import {useCookies} from 'react-cookie'
import moment from 'moment'

const {RangePicker} = DatePicker
const breadcrumbs = [{text: '账务管理'}, {text: '资产余额'}]
const pageParams = {
  pageNum: 1,
  pageSize: 10,
}
let values = {}
function body(props) {
  const [list, setList] = useState([])
  const [cookies] = useCookies(['tenantId'])
  const [productList, setProductList] = useState([])
  const [totalData, setTotalData] = useState([])
  const [form] = Form.useForm()
  // const [assetsList, setAssetsList] = useState([])
  const [channelList, setChannelList] = useState([])
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
    fetchAssetList()
    changeChannel()
    fetchData()
  }, [])
  const fetchAssetList = async (values = {}) => {
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
      } = await apiAccounting.fetch_asset_list({...pageParams, ...values})
      if (code == 0) {
        setTotalData(data)
        setList(data.list)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getCurrentMonthFirst = () => {
    var date = new Date()
    date.setDate(1)
    return date
  }

  const onSearch = async (value) => {
    console.log(value)
    values = value
    pageParams.pageNum = 1
    fetchAssetList({...values})
  }

  const onReset = () => {
    form.resetFields()
    onSearch({})
  }

  const onPage = async () => {
    fetchAssetList(values)
  }
  const changeChannel = async (val) => {
    try {
      const {
        data: {data, code},
      } = await apiAccounting.get_data_dict('LOAN_APPLY_SOURCE')
      if (code === 0) {
        setChannelList(data)
      }
    } catch (err) {
      console.log(err)
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
            time: [
              moment(getCurrentMonthFirst(), 'YYYY-MM-DD'),
              moment(
                new Date(new Date().setDate(new Date().getDate())),
                'YYYY-MM-DD',
              ),
            ],
            productId: null,
            comanyId: null,
          }}
        >
          <Form.Item label="日期" name="time">
            <RangePicker />
          </Form.Item>
          <Form.Item label="产品" name="productId">
            <Select
              style={{width: '160px'}}
              showSearch
              optionFilterProp="children"
            >
              <Select.Option value={null}>全部</Select.Option>
              {productList.map((v, i) => (
                <Select.Option key={i} value={v.id}>
                  {v.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="进件渠道" name="comanyId">
            <Select
              style={{width: '160px'}}
              showSearch
              optionFilterProp="children"
            >
              <Select.Option value={null}>全部</Select.Option>
              {channelList.map((v, i) => (
                <Select.Option key={i} value={v.code}>
                  {v.description}
                </Select.Option>
              ))}
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
          }}
        />
      </Space>
    </Layout>
  )
}

export default body
