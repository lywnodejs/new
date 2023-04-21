import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef} from 'react'
import fetch from '~/utils/fetch'
// import {scrollTop} from '~/utils'
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
// import {BUSINESS_TYPE} from '~/utils/const'

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

const breadcrumbs = [{text: '用户管理'}, {text: '用户管理'}]

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
      initialValues={{bizStatus: '', channel: ''}}
      style={{marginBottom: 30}}
    >
      <Form.Item label="注册日期" name="time">
        <DatePicker.RangePicker />
      </Form.Item>

      <Form.Item label="用户ID/手机号" name="mobilephone">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="用户姓名" name="userName">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="注册渠道" name="channel">
        <Input placeholder="请输入" />
      </Form.Item>

      <Form.Item label="当前业务状态" name="bizStatus">
        <Select style={{width: 120}}>
          <Select.Option value="">全部</Select.Option>
          {/* {BUSINESS_TYPE.map((v) => { */}
          {/*   return ( */}
          {/*     <Select.Option value={v.value} key={v.value}> */}
          {/*       {v.name} */}
          {/*     </Select.Option> */}
          {/*   ) */}
          {/* })} */}
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
    // scrollTop()
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
    // {
    //   title: '当前业务状态',
    //   dataIndex: 'bisStatus',
    //   render: (t) => {
    //     let item = BUSINESS_TYPE.find((v) => +v.value === t)
    //     return item ? item.name : '-'
    //   },
    // },
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
      <Search search={onSearch} download={downloadData} />
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
  let data = await getData()
  return {data}
}

export default body
