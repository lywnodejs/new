import {Layout} from '~/components/Layout'
import React, {useState, useEffect, useRef} from 'react'
import DataSourceSelect from '~/components/common/DataSourceSelect'
import api from '~/utils/api'
import {Button, Table, Space, Form, DatePicker} from 'antd'
import {SearchOutlined, CloseCircleOutlined} from '@ant-design/icons'
import moment from 'moment'
import DateSelect from '~/components/common/DateSelect'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await api.getDataDateReport(params)

  if (code == 0) {
    if (Array.isArray(data.list)) {
      data.list.forEach((v, i) => {
        v.id = params.pageNo + '' + i
      })
    }
    return data
  }
  return {list: []}
}

const breadcrumbs = [{text: '报表中心'}, {text: '数据产品分日统计报表'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const [time] = useState([
    moment().subtract(7, 'd'),
    moment().subtract(1, 'd'),
  ])
  const onSearch = () => {
    let {time, ...params} = form.getFieldsValue()
    if (!!time) {
      params.statDateStart = moment(time[0]).format('YYYY-MM-DD')
      params.statDateEnd = moment(time[1]).format('YYYY-MM-DD')
    }
    Object.keys(params).forEach(function (key) {
      if (!params[key]) {
        delete params[key]
      }
    })

    props.search(params)
  }

  const initData = (params, isInit) => {
    form.setFieldsValue(params)
    if (isInit) {
      onSearch()
    }
  }

  return (
    <Form
      form={form}
      name="search"
      layout="inline"
      initialValues={{time}}
      className="form"
    >
      <Form.Item label="日期" name="time">
        <DateSelect />
      </Form.Item>

      <DataSourceSelect init={initData} />

      <Form.Item>
        <Space>
          <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
            查询
          </Button>
          <Button type="primary" onClick={props.download}>
            下载
          </Button>
        </Space>
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

  const onChangePage = (
    pageNo = pageParams.pageNo,
    pageSize = pageParams.pageSize,
  ) => {
    pageParams.pageNo = pageNo
    pageParams.pageSize = pageSize
    updateList({...searchParams, ...pageParams})
  }

  const paginationConfig = {
    total: data.totalSize,
    current: pageParams.pageNo,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSize: pageParams.pageSize,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  const updateList = async (params) => {
    let data = await getData(params)
    setData(data)
  }

  const downloadData = async () => {
    const params = {...searchParams, ...pageParams}
    api.downloadDataDate(params)
  }

  const columns = [
    {title: '日期', dataIndex: 'statDate'},
    {title: '数据源名称', dataIndex: 'companyName'},
    {title: '数据产品名称', dataIndex: 'dataProductName'},
    {title: '业务名称', dataIndex: 'callerName'},
    {title: '调用次数', dataIndex: 'callsCount'},
    {title: '失败次数', dataIndex: 'failCount'},
    {title: '稳定性', dataIndex: 'successRate'},
  ]

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search search={onSearch} download={downloadData} />

      <Table
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        scroll={{x: '100%', y: 'calc(100vh - 390px)'}}
        dataSource={data.list || []}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  return {data: {list: []}}
}

export default body
