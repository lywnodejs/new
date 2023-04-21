import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef} from 'react'
import fetch from '~/utils/fetch'
import {scrollTop} from '~/utils'
import {
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Select,
} from 'antd'
import Router from 'next/router'
import {SearchOutlined, CloseCircleOutlined} from '@ant-design/icons'
import moment from 'moment'
import {BUSINESS_TYPE} from '~/utils/const'
import api from '~/utils/api'

const pageParams = {
  pageNo: 1,
  pageSize: 20,
}
const getData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await fetch('bank.api.userqueryservice.queryuser', [params])
  if (code == 0) {
    return data
  }
  return {list: []}
}

const breadcrumbs = [{text: '用户运营'}, {text: '用户列表'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const onSearch = () => {
    let {time, ...params} = form.getFieldsValue()
    if (!!time) {
      params.startTime = moment(time[0]).format('YYYY-MM-DD')
      params.endTime = moment(time[1]).format('YYYY-MM-DD')
    }
    Object.keys(params).forEach(function (key) {
      if (!params[key]) {
        delete params[key]
      }
    })

    props.search(params)
  }
  return (
    <Form
      form={form}
      name="search"
      layout="inline"
      initialValues={{bizStatus: '', channelName: '', productId: null}}
      style={{marginBottom: 30}}
    >
      <Form.Item label="注册日期" name="time">
        <DatePicker.RangePicker />
      </Form.Item>

      <Form.Item label="手机号" name="mobilephone">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="用户姓名" name="userName">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="产品名称" name="productId">
        <Select style={{width: 120}}>
          <Select.Option value={null}>全部</Select.Option>
          {props.products.map((v, i) => {
            return (
              <Select.Option value={v.id} key={i}>
                {v.name}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item label="注册渠道" name="channelName">
        <Select style={{width: 180}}>
          <Select.Option value="">全部</Select.Option>
          {props.channels.map((v, i) => {
            return (
              <Select.Option value={v} key={i}>
                {v}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item label="当前业务状态" name="bizStatus">
        <Select style={{width: 120}}>
          <Select.Option value="">全部</Select.Option>
          {BUSINESS_TYPE.map((v) => {
            return (
              <Select.Option value={v.value} key={v.value}>
                {v.name}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
          搜索
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={props.download}>
          下载
        </Button>
      </Form.Item>
    </Form>
  )
}

function body(props) {
  const [data, setData] = useState(props.data)
  const [searchParams, setSearchParams] = useState({})

  const onSearch = (params) => {
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const onChangePage = (pageNo = pageParams.pageNo) => {
    pageParams.pageNo = pageNo
    updateList({...searchParams, ...pageParams})
    scrollTop()
  }

  const updateList = async (params) => {
    let data = await getData(params)
    setData(data)
  }

  const columns = [
    {title: '用户ID', dataIndex: 'id'},
    {title: '用户手机号', dataIndex: 'mobilephone'},
    {title: '用户姓名', dataIndex: 'userName'},
    {title: '注册时间', dataIndex: 'registerTime'},
    {title: '产品名称', dataIndex: 'productName'},
    {title: '注册渠道', dataIndex: 'channel'},
    {
      title: '当前业务状态',
      dataIndex: 'bisStatus',
      render: (t) => {
        let item = BUSINESS_TYPE.find((v) => +v.value === t)
        return item ? item.name : '-'
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const downloadData = async () => {
    const params = {...searchParams, ...pageParams}

    let {
      data: {code, data},
    } = await fetch('bank.api.userqueryservice.getdownloadurl', [params])
    if (code == 0) {
      location.href = data
    }
  }

  const paginationConfig = {
    total: data.totalSize,
    current: pageParams.pageNo,
    showSizeChanger: false,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search
        search={onSearch}
        products={props.products}
        channels={props.channels}
        download={downloadData}
      />
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
  try {
    const [
      list,
      {
        data: {data: products},
      },
      {
        data: {data: channels},
      },
    ] = await Promise.all([
      getData(),
      api.getPro4userList(),
      fetch('bank.api.channelsservice.getchannelsname'),
    ])
    return {data: list, products, channels}
  } catch (e) {
    return {data: [], products: [], channels: []}
  }
}

export default body
