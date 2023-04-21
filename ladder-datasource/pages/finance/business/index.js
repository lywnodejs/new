import {Layout} from '~/components/Layout'
import React, {useState, useEffect, useRef} from 'react'
import api from '~/utils/api'
import {
  Button,
  Table,
  Space,
  Card,
  Badge,
  Form,
  DatePicker,
  Select,
  Empty,
} from 'antd'
import {SearchOutlined, CloseCircleOutlined} from '@ant-design/icons'
import DateSelect from '~/components/common/DateSelect'
import moment from 'moment'
import dynamic from 'next/dynamic'

const Line = dynamic(
  () => import('@ant-design/charts').then((mod) => mod.Line),
  {
    ssr: false,
  },
)

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}

const getData = async (params = {...pageParams}) => {
  let {
    data: {code, data},
  } = await api.getFinBusinessList(params)
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

const getTimes = (timeArray) => {
  return {
    statDateStart: moment(timeArray[0]).format('YYYY-MM-DD'),
    statDateEnd: moment(timeArray[1]).format('YYYY-MM-DD'),
  }
}

const breadcrumbs = [{text: '财务管理'}, {text: '业务财务报表'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const [time] = useState([
    moment().subtract(14, 'd'),
    moment().subtract(1, 'd'),
  ])

  useEffect(() => {
    onSearch()
  }, [])

  const onSearch = () => {
    let {time, ...params} = form.getFieldsValue()
    if (!!time) {
      params = {...params, ...getTimes(time)}
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
      initialValues={{callerId: null, time}}
      className="form"
    >
      <Form.Item label="日期" name="time">
        <DateSelect />
      </Form.Item>

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
  const [lineData, setlineData] = useState([])

  const config = {
    data: lineData,
    xField: 'xValue',
    yField: 'yValue',
    seriesField: 'type',
    legend: {position: 'right-top'},
  }

  const onSearch = (params) => {
    setSearchParams(params)
    setChartData(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const setChartData = async (params) => {
    let {
      data: {code, data},
    } = await api.getFinBusinessChart(params)
    // pointList xValue yValue lineTagName

    let resArray = []
    if (code == 0 && Array.isArray(data)) {
      data.forEach((v, i) => {
        let childArr = Array.isArray(v.pointList)
          ? v.pointList.map((cv) => {
              cv.type = v.lineTagName
              cv.yValue = parseFloat(cv.yValue)
              // cv.type = v.lineTagCode
              return cv
            })
          : []

        resArray = [...resArray, ...childArr]
      })
    }
    console.log(resArray)
    setlineData(resArray)
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

  const downloadData = async () => {
    const params = {...searchParams, ...pageParams}
    api.downloadFinBus(params)
  }

  const columns = [
    {title: '日期', dataIndex: 'statDate'},
    {title: '业务名称', dataIndex: 'callerName'},
    {title: '调用次数', dataIndex: 'callsCount'},
    {title: '成功次数', dataIndex: 'successCount'},
    {title: '查得数', dataIndex: 'dataCount'},
    {title: '总价（元）', dataIndex: 'totalCost'},
  ]

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

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Search
        search={onSearch}
        business={props.business}
        download={downloadData}
      />

      <Card
        title=""
        headStyle={{borderBottom: 'none'}}
        style={{marginBottom: 15}}
        extra={<Badge color="blue" text="总价（元）" />}
      >
        {lineData.length > 0 ? <Line {...config} /> : <Empty />}
      </Card>

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

body.getInitialProps = async (params) => {
  let business = await api.getBusiness4select()
  return {data: {list: []}, business}
}

export default body
