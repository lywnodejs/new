import {Layout} from '~/components/Layout'
import DataSourceSelect from '~/components/common/DataSourceSelect'
import React, {useState, useEffect, useRef} from 'react'
import {Button, Table, Space, Card, Radio, Form, DatePicker, Empty} from 'antd'
import {SearchOutlined, CloseCircleOutlined} from '@ant-design/icons'
import moment from 'moment'
import dynamic from 'next/dynamic'
import api from '~/utils/api'
import DateSelect from '~/components/common/DateSelect'

const Area = dynamic(
  () => import('@ant-design/charts').then((mod) => mod.Area),
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
  } = await api.getMonitorReport(params)

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

const breadcrumbs = [{text: '数据监控'}, {text: '数据监控报表'}]

const Search = (props) => {
  const [form] = Form.useForm()
  const [time] = useState([
    moment().subtract(14, 'd'),
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

const RATE_META = {
  values: [0, 20, 40, 60, 80, 100],
  formatter: (v) => {
    return v + '%'
  },
}
const TYPES = [
  {key: 'successRate', name: '稳定性'},
  {key: 'getDataRate', name: '查得率'},
  {key: 'avgRespSecs', name: '响应时间'},
]

function body(props) {
  const [data, setData] = useState(props.data || {})
  const [searchParams, setSearchParams] = useState({})
  const [lineType, setLineType] = useState({key: 'successRate', name: '稳定性'})
  const ref = React.useRef()
  const [lineData, setlineData] = useState([])
  const [chartData, setChartsData] = useState(null)

  const config = {
    data: lineData,
    meta: {
      yValue:
        lineType.key == 'avgRespSecs'
          ? null
          : {
              values: [0, 20, 40, 60, 80, 100],
              formatter: (v) => {
                return v + '%'
              },
            },
    },
    yAxis: {
      label: {
        formatter: (v) => {
          let label = ''
          lineType.key !== 'avgRespSecs'
            ? (label = v)
            : (label = Number(v).toFixed(2))
          return label
        },
      },
    },
    xField: 'xValue',
    yField: 'yValue',
    tooltip: {
      visible: true,
      formatter: (v, val) => {
        return {
          name: lineType.name,
          value:
            lineType.key == 'avgRespSecs' ? v.yValue + 's' : v.yValue + '%',
        }
      },
    },
    areaStyle: {
      fill: 'l(270) 0:#ffffff 1:#5B8FF9',
    },
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
    } = await api.getMonitorReportChart({...params, queryType: 1})
    // pointList xValue yValue
    // 响应时间 avgRespSecs
    // 稳定性 successRate
    // 查得率 getDataRate
    let chartData = {
      avgRespSecs: [],
      successRate: [],
      getDataRate: [],
    }
    if (code == 0 && Array.isArray(data.list)) {
      data.list.forEach((v, i) => {
        if (v.statDate != '合计') {
          Object.keys(chartData).forEach(function (key) {
            let obj = {
              xValue: v.statDate,
            }
            if (key == 'avgRespSecs') {
              obj.yValue = parseFloat(v[key])
            } else {
              const value = parseFloat(v[key].split('%')[0])
              obj.yValue = Number.isNaN(value) ? 0 : value
            }
            chartData[key].push(obj)
          })
        }
      })
    }
    setChartsData(chartData)
    setlineData(chartData[lineType.key])
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
    api.downloadMonitor(params)
  }

  const onChangeType = (e) => {
    let type = e.target.value
    let item = TYPES.find((v) => v.key == type)
    setLineType(item)
    setlineData(chartData[type])

    // return
    // ref.current.updateConfig(config)
    // ref.current.render()
  }

  const columns = [
    {title: '日期', dataIndex: 'statDate'},
    {title: '数据源名称', dataIndex: 'companyName'},
    {title: '数据产品名称', dataIndex: 'dataProductName'},
    {title: '调用次数', dataIndex: 'callsCount'},
    {title: '失败次数', dataIndex: 'failCount'},
    {title: '稳定性', dataIndex: 'successRate'},
    {title: '查得数', dataIndex: 'dataCount'},
    {title: '查得率', dataIndex: 'getDataRate'},
    {title: '平均响应时间(S)', dataIndex: 'avgRespSecs'},
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
      <Search search={onSearch} download={downloadData} />

      <Card
        title="单产品分日数据监控"
        style={{marginBottom: 15}}
        extra={
          <Radio.Group onChange={onChangeType} value={lineType.key}>
            {TYPES.map((v, i) => {
              return (
                <Radio value={v.key} key={i}>
                  {v.name}
                </Radio>
              )
            })}
          </Radio.Group>
        }
      >
        {lineData.length > 0 ? <Area {...config} chartRef={ref} /> : <Empty />}
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
  // let data = await getData()
  return {data: {list: []}}
}

export default body
