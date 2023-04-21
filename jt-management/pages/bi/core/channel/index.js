import {Layout} from '~/components/Layout'
import {useEffect, useState, useRef} from 'react'
import React, {PureComponent} from 'react'
import moment from 'moment'
import {
  Form,
  Input,
  Button,
  Table,
  Modal,
  Select,
  InputNumber,
  List,
  Space,
  DatePicker,
  Radio,
} from 'antd'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import {CSVLink, CSVDownload} from 'react-csv'
import style from './style.less'
import {biFetch} from '~/utils/fetch'

const {RangePicker} = DatePicker

const breadcrumbs = [
  {text: 'BI 报表'},
  {text: '核心指标'},
  {text: '分渠道报表'},
]

const startDate = moment(moment().subtract(14, 'days')).format('YYYY-MM-DD')
const endDate = moment().subtract(1, 'days').format('YYYY-MM-DD')

const pages = {
  pageNo: 1,
  pageSize: 20,
}

const fetchList = async (
  params = {
    startDate,
    endDate,
    ...pages,
  },
) => {
  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      delete params[key]
    }
  }
  const startDate = Array.isArray(params.date)
    ? moment(params.date[0]).format('YYYY-MM-DD')
    : undefined
  const endDate = Array.isArray(params.date)
    ? moment(params.date[1]).format('YYYY-MM-DD')
    : undefined

  delete params.date

  return await biFetch('/core/index/query', {
    startDate,
    endDate,
    ...params,
  })
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const columns = [
  {title: '报表日期', dataIndex: 'statDate', width: 150},
  {title: '渠道', dataIndex: 'srcChannel', width: 100},
  {title: '进件客户数', dataIndex: 'applyUser', width: 120},
  {title: '授信客户数', dataIndex: 'applySuccessUser', width: 120},
  {title: '授信金额(元)', dataIndex: 'applySuccessAmt', width: 120},
  {title: '授信平均额度(元)', dataIndex: 'avgApplySuccessAmt', width: 150},
  {title: '申请用信笔数', dataIndex: 'loanCnt', width: 150},
  {title: '放款笔数', dataIndex: 'grantCnt', width: 100},
  {title: '放款金额(元)', dataIndex: 'grantAmt', width: 150},
  {title: '用信平均额度(元)', dataIndex: 'avgLoanAmt', width: 150},
  {
    title: '授信成功率',
    dataIndex: 'applySuccessRateText',
    width: 120,
  },
  {
    title: '用信过件率',
    dataIndex: 'loanOverApplyRateText',
    width: 120,
  },
  {title: '在贷笔数', dataIndex: 'onLoanCnt', width: 100},
  {title: '在贷金额(元)', dataIndex: 'onLoanAmt', width: 120},
  {
    title: '授信使用率',
    dataIndex: 'creditUsedRateText',
    width: 120,
  },
  {
    title: '入催率',
    dataIndex: 'intoCollRateText',
    width: 100,
  },
  {
    title: 'M1回收率',
    dataIndex: 'm1RecoveryRateText',
    width: 100,
  },
  {title: 'M1比例', dataIndex: 'm1RateText', width: 100},
  {title: 'M2比例', dataIndex: 'm2RateText', width: 100},
  {title: 'M3+比例', dataIndex: 'm3PlusRateText', width: 100},
]

const Chart = ({channels, list, form}) => {
  const [value, setValue] = useState('loanOverApplyRate')

  let data = []
  let channel = form.getFieldsValue()['srcCode']
  // console.log(channel)
  let temp = channels
  if (channel) {
    temp = channels.filter((y) => y.srcCode === channel)
  }

  temp.forEach((v) => {
    let res = list.filter((s) => s.srcChannel === v.name)
    // console.log('res', res)
    res = [...res].reverse()
    // console.log('reversed:', res)
    data.push({channel: v.name, data: res, color: getRandomColor()})
  })

  data.sort((a, b) => b.data.length - a.data.length)
  // console.log(data)

  const onChange = (e) => {
    console.log(e.target.value)
    setValue(e.target.value)
  }

  return (
    <div className={style.chart}>
      <h3>分渠道分日质量</h3>
      <div className={style.radios}>
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={'applySuccessRate'}>授信成功率</Radio>
          <Radio value={'loanOverApplyRate'}>用信过件率</Radio>
          <Radio value={'intoCollRate'}>入催率</Radio>
          <Radio value={'m2Rate'}>M2比例</Radio>
        </Radio.Group>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="statDate"
            type="category"
            allowDuplicatedCategory={false}
          />
          <YAxis dataKey={value} unit="%" />
          <Tooltip />
          <Legend align="right" verticalAlign="top" />
          {data.map((s) => (
            <Line
              dataKey={value}
              data={s.data}
              stroke={s.color}
              name={s.channel}
              key={s.channel}
              unit="%"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const TableList = ({list}) => {
  return (
    <Table
      rowKey={(v, i) => i}
      dataSource={list}
      columns={columns}
      scroll={{x: 1500, y: 'calc(100vh - 350px)'}}
    />
  )
}

let headers = columns.map((v) => {
  return {
    label: v.title,
    key: v.dataIndex,
  }
})

const DownloadCSV = ({form}) => {
  const csvInstance = useRef()
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  const onDownload = async () => {
    setLoading(true)
    let values = form.getFieldsValue()
    const {
      data: {code, data: list},
    } = await fetchList(values)

    if (code === 0) {
      setData(list)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (data !== undefined && csvInstance.current && csvInstance.current.link) {
      setTimeout(() => {
        csvInstance.current.link.click()
        setData(undefined)
      })
    }
  }, [data])

  return (
    <>
      <CSVLink headers={headers} data={data || []} ref={csvInstance}></CSVLink>
      <Button loading={loading} type="primary" onClick={onDownload}>
        下载
      </Button>
    </>
  )
}

const Search = ({onSearch, channels, products, form}) => {
  return (
    <Form
      layout="inline"
      form={form}
      initialValues={{
        date: [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')],
        srcCode: '',
        productId: '',
      }}
      onFinish={onSearch}
      className="searchForm"
    >
      <Form.Item
        label="申请日期"
        name="date"
        {...{
          rules: [{type: 'array', required: true, message: '请选时间!'}],
        }}
      >
        <RangePicker />
      </Form.Item>

      <Form.Item label="产品" name="productId">
        <Select style={{width: 120}}>
          <Select.Option value="">全部</Select.Option>
          {products.map((v) => (
            <Select.Option key={v.productId} value={v.productId}>
              {v.productName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="进件渠道" name="srcCode">
        <Select style={{width: 120}}>
          <Select.Option value="">全部</Select.Option>
          {channels.map((v) => (
            <Select.Option key={v.srcCode} value={v.srcCode}>
              {v.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
      </Form.Item>

      <Form.Item>
        <DownloadCSV {...{form}} />
      </Form.Item>
    </Form>
  )
}

const body = ({list, channels, products}) => {
  const [form] = Form.useForm()
  const [data, setData] = useState(list)

  const onSearch = async (values) => {
    // console.log(values)
    const {
      data: {code, data},
    } = await fetchList({...values, ...pages})

    if (code === 0) {
      setData(data)
    }
  }

  const onPage = (page) => {
    const values = form.getFieldsValue()
    pages.pageNo = page
    onSearch(values)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Search {...{onSearch, channels, products, form}} />
        <Chart list={data} channels={channels} form={form} />
        <TableList list={data} />
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  try {
    const [
      {
        data: {code, data: list = []},
      },
      {
        data: {data: channels = []},
      },
      {
        data: {data: products = []},
      },
    ] = await Promise.all([
      fetchList(),
      biFetch('/common/allChannel'),
      biFetch('/common/allProduct'),
    ])

    // console.log(list, channels, products)

    return {
      list,
      channels,
      products,
    }
  } catch (e) {
    console.log(e)
  }
  return {
    list: [],
    channels: [],
    products: [],
  }
}

export default body
