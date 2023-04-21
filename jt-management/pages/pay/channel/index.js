import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import apiPay from '~/api/pay'

import apiAccount from '~/api/accounting'
import {Button, Table, Form, Input, Card, Select} from 'antd'

import {useCookies} from 'react-cookie'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
  status: 1,
}
const getData = async (params = pageParams) => {
  try {
    let {
      data: {code, data},
    } = await apiPay.getPayChannelList(params)
    if (code == 0) {
      return data
    }
    return []
  } catch (e) {
    return []
  }
}

const breadcrumbs = [{text: '支付管理'}, {text: '支付通道列表'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    props.search(form.getFieldsValue())
  }

  return (
    <Card style={{marginBottom: 30}}>
      <Form
        form={form}
        initialValues={{payChannelCode: null}}
        name="search"
        layout="inline"
      >
        <Form.Item name="payChannelCode" label="支付通道">
          <Select style={{width: '150px'}}>
            <Select.Option value={null}>全部</Select.Option>
            {props.channels.map((v, i) => (
              <Select.Option key={i} value={v.code}>
                {v.description}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="merchantId" label="账号">
          <Input placeholder="账号" style={{width: 180}} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={onSearch}>
            查询
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

function body(props) {
  const [data, setData] = useState(props.data)
  const [searchParams, setSearchParams] = useState({})
  const [channels, setChannels] = useState([])
  const [company, setCompany] = useState([])
  const [cookies] = useCookies(['tenantId'])

  useEffect(() => {
    getDict('FUND_PAY_CHANNEL_MODE_CODE', setChannels)
    getDict('FUND_COMPANY_CODE', setCompany)
    // fetchProductList()
  }, [])

  const getDict = async (type, func) => {
    try {
      const {data} = await apiAccount.get_data_dict(type)
      if (data.code == 0) {
        func(data.data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const onSearch = (params) => {
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const onChangePage = (pageNo = pageParams.pageNo) => {
    pageParams.pageNo = pageNo
    updateList({...searchParams, ...pageParams})
  }

  const updateList = async (params) => {
    let data = await getData({...params})

    setData(data)
  }

  const getByDict = (val, list) => {
    const item = list.find((v) => v.code == val)
    return (item && item.description) || ''
  }

  const columns = [
    {
      title: '支付通道',
      dataIndex: 'payChannelCode',
      render: (t) => {
        return getByDict(t, channels)
      },
    },
    {title: '账号', dataIndex: 'merchantId'},
    {
      title: '接入主体',
      dataIndex: 'companyCode',
      render: (t) => {
        return getByDict(t, company)
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const paginationConfig = {
    total: data.total,
    current: pageParams.pageNo,
    showSizeChanger: false,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search channels={channels} search={onSearch} />

      <Table
        bordered
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        dataSource={data.list || []}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  pageParams.pageNo = 1
  let data = await getData()
  return {data}
}

export default body
