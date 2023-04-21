import {Layout} from '~/components/Layout'
import React, {useState, useCallback, useRef} from 'react'
import api from '~/utils/api'
import DataSourceSelect from '~/components/common/DataSourceSelect'
import DateSelect from '~/components/common/DateSelect'
import {
  Button,
  Table,
  Space,
  Form,
  Input,
  DatePicker,
  Select,
  Row,
  Col,
} from 'antd'
import Router from 'next/router'
import {
  SearchOutlined,
  CloseCircleOutlined,
  FileExcelOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import {SERVICE_TYPE} from '~/utils/const'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = {...pageParams}) => {
  console.log(params)

  let {
    data: {code, data},
  } = await api.getRecordList(params)
  if (code == 0) {
    return data
  }
  return {list: []}
}

const breadcrumbs = [{text: '明细管理'}, {text: '用户记录查询'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const [time] = useState([
    moment().subtract(1, 'd'),
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
  const onDownLoad = () => {
    props.downLoad()
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
      initialValues={{time, callerId: null}}
      className="form"
    >
      <Row justify="start" align="middle" style={{height: 106}}>
        <Form.Item label="查询时间" name="time">
          <DateSelect />
        </Form.Item>

        <Form.Item label="姓名" name="name">
          <Input placeholder="请输入" />
        </Form.Item>

        <Form.Item label="手机号" name="mobile">
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="身份证" name="idCard">
          <Input placeholder="请输入" />
        </Form.Item>
        <DataSourceSelect init={initData} isAllData={true} isAllPro={true} />

        <Form.Item label="业务名称" name="callerId">
          <Select style={{width: 120}}>
            <Select.Option value={null} key={-1}>
              全部
            </Select.Option>
            {props.business.map((v, i) => (
              <Select.Option value={v.id} key={i}>
                {v.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
            查询
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={onDownLoad}
          >
            查询导出
          </Button>
        </Form.Item>
      </Row>
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
  const onDownLoad = () => {
    api.downloadFile('/ds/record/download/recordDownload', {
      ...pageParams,
      ...searchParams,
    })
  }

  const onChangePage = (
    pageNo = pageParams.pageNo,
    pageSize = pageParams.pageSize,
  ) => {
    pageParams.pageNo = pageNo
    pageParams.pageSize = pageSize
    updateList({...searchParams, ...pageParams})
  }

  const updateList = async (params) => {
    let data = await getData(params)
    setData(data)
  }

  const columns = [
    {title: '查询时间', dataIndex: 'createTime'},
    {title: '姓名', dataIndex: 'name'},
    {title: '手机号', dataIndex: 'mobile'},
    {title: '身份证号', dataIndex: 'idCard'},
    {title: '数据源名称', dataIndex: 'companyName'},
    {title: '数据产品名称', dataIndex: 'dataProductName'},
    {title: '业务名称', dataIndex: 'callerName'},
    {title: '查询结果', dataIndex: 'successName'},
    {
      title: '操作',
      render: (t, r, i) => {
        return (
          <Space>
            <a href={`/query/record/list/detail?id=${r.id}`}>
              <Button type="link" className="handle_one_button">
                查看结果
              </Button>
            </a>
          </Space>
        )
      },
    },
  ]

  const paginationConfig = {
    total: data.totalSize,
    current: pageParams.pageNo,
    showSizeChanger: true,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search
        search={onSearch}
        downLoad={onDownLoad}
        business={props.business}
      />
      <Table
        className="globalTableNoScroll"
        rowKey="id"
        pagination={paginationConfig}
        columns={columns}
        dataSource={data.list || []}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  let business = await api.getBusiness4select()
  return {data: {list: []}, business}
}

export default body
