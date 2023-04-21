import {useEffect, useState, useRef} from 'react'
import {Layout} from '~/components/Layout'
import {Button, DatePicker, Form, Select, Table, Tabs, Space} from 'antd'
import nextId from 'react-id-generator'
import moment from 'moment'
import {biFetch} from '~/utils/fetch'
import {CSVLink} from 'react-csv'

const {RangePicker} = DatePicker
const {Option} = Select
const {TabPane} = Tabs

const breadcrumbs = [{text: 'BI报表'}, {text: '贷后分析'}, {text: '催收报表'}]

const tabs = ['到期金额', '到期笔数']
const urls = ['/coll/stat/amount', '/coll/stat/count']

const columns = [
  [
    {
      title: '到期日期',
      dataIndex: 'dueDate',
      align: 'left',
      width: 150,
      fixed: 'left',
    },
    {
      title: '渠道',
      dataIndex: 'srcChannel',
      align: 'left',
      width: 100,
      fixed: 'left',
    },
    {
      title: '到期本金',
      dataIndex: 'dueCapitalAmt',
      align: 'left',
      width: 100,
      fixed: 'left',
    },
    {
      title: '入催本金',
      dataIndex: 'collCapitalAmt',
      align: 'left',
      width: 100,
      fixed: 'left',
    },
    {
      title: '入催率',
      dataIndex: 'dueCollRate',
      align: 'left',
      width: 100,
      fixed: 'left',
    },
    {
      title: '催回率',
      dataIndex: 'collBackRate',
      align: 'left',
      width: 100,
      fixed: 'left',
    },
    ...[1, 3, 10, 30, 60, 90].map((v) => ({
      title: `${v}日内催回本金`,
      dataIndex: `collBackAmtDay${v}`,
      align: 'left',
      width: 150,
    })),
    ...[1, 3, 10, 30, 60, 90].map((v) => ({
      title: `${v}日催回率`,
      dataIndex: `collBackRateDay${v}`,
      align: 'left',
      width: 120,
    })),
  ],
  [
    {
      title: '到期日期',
      dataIndex: 'dueDate',
      align: 'left',
      width: 100,
      fixed: 'left',
    },
    {
      title: '渠道',
      dataIndex: 'srcChannel',
      align: 'left',
      width: 100,
      fixed: 'left',
    },
    {
      title: '到期笔数',
      dataIndex: 'dueCnt',
      align: 'left',
      width: 100,
      fixed: 'left',
    },
    {
      title: '入催笔数',
      dataIndex: 'collCnt',
      align: 'left',
      width: 100,
      fixed: 'left',
    },
    {
      title: '入催率',
      dataIndex: 'dueCollRate',
      align: 'left',
      width: 100,
      fixed: 'left',
    },
    {
      title: '催回率',
      dataIndex: 'collBackRate',
      align: 'left',
      width: 100,
      fixed: 'left',
    },
    ...[1, 3, 10, 30, 60, 90].map((v) => ({
      title: `${v}日内催回笔数`,
      dataIndex: `collBackCntDay${v}`,
      align: 'left',
      width: 150,
    })),
    ...[1, 3, 10, 30, 60, 90].map((v) => ({
      title: `${v}日内催回率`,
      dataIndex: `collBackRateDay${v}`,
      align: 'left',
      width: 120,
    })),
  ],
]

const pages = [
  {
    pageNo: 1,
    pageSize: 20,
  },
  {
    pageNo: 1,
    pageSize: 20,
  },
]

const startDate = moment().subtract(7, 'days').format('YYYY-MM-DD')
const endDate = moment().subtract(1, 'days').format('YYYY-MM-DD')

const fetchList = async (url, params) => {
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

  const data = await biFetch(url, {
    startDate,
    endDate,
    ...params,
  })
  // console.log(data.data, '------------------------')
  return data
}

const TableList = ({
  onPage,
  tab,
  data: {list = [], pageRet = {}},
  columns = [],
}) => {
  const onShowSizeChange = (current, size) => {
    console.log(current, size)
    pages[tab].pageSize = size
  }

  // console.log('list: ', list)
  // console.log('table:', pages[tab], list)
  const pagination = {
    position: 'bottom',
    current: pages[tab].pageNo,
    total: pageRet.totalCount,
    pageSize: pages[tab].pageSize,
    showTotal: (total) => `共 ${pageRet.totalCount} 条记录`,
    onChange: onPage,
    onShowSizeChange,
    showSizeChanger: true,
    showQuickJumper: true,
  }

  return (
    <Table
      rowKey={() => `tab-${tab}-${nextId()}`}
      dataSource={list}
      columns={columns}
      pagination={pagination}
      scroll={{x: 1500}}
    />
  )
}

const DownloadCSV = ({form, tab}) => {
  const csvInstance = useRef()
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  const onDownload = async () => {
    setLoading(true)
    let values = form.getFieldsValue()
    const {
      data: {code, data: list},
    } = await fetchList(urls[tab], values)
    if (code === 0) {
      setData(list)
    }
    setLoading(false)
  }

  useEffect(() => {
    if (
      data.list !== undefined &&
      csvInstance.current &&
      csvInstance.current.link
    ) {
      setTimeout(() => {
        csvInstance.current.link.click()
        setData({})
      })
    }
  }, [data])

  let headers = columns[tab].map((column) => ({
    label: column.title,
    key: column.dataIndex,
  }))

  return (
    <>
      <CSVLink
        headers={headers}
        data={data.list || []}
        ref={csvInstance}
      ></CSVLink>
      <Button loading={loading} type="primary" onClick={onDownload}>
        下载
      </Button>
    </>
  )
}

const beforeDate = function (n) {
  var now = new Date()
  now.setDate(now.getDate() - 15)
  return now
}

const afterDate = function (n) {
  var now = new Date()
  now.setDate(now.getDate() + 15)
  return now
}

const Search = ({onSearch, channels, products, form, fetchList, tab}) => {
  return (
    <Form
      layout="inline"
      form={form}
      initialValues={{
        // date: [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')],
        date: [
          moment(beforeDate(15), 'YYYY-MM-DD'),
          moment(afterDate(15), 'YYYY-MM-DD'),
        ],
        srcCode: '',
        productId: '',
      }}
      onFinish={onSearch}
      className="searchForm"
    >
      <Form.Item
        label="到期日期"
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
          <Option value="">全部</Option>
          {channels.map((v) => (
            <Option key={v.srcCode} value={v.srcCode}>
              {v.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
      </Form.Item>

      <Form.Item>
        <DownloadCSV {...{form, tab}} />
      </Form.Item>
    </Form>
  )
}

const body = ({list, channels, products}) => {
  const [form] = Form.useForm()
  let [data, setData] = useState(list)
  let [tab, setTab] = useState(0)

  const onSearch = async (values, pageNo = 1) => {
    pages[tab].pageNo = pageNo
    const {
      data: {code, data: result},
    } = await fetchList(urls[tab], {...values, ...pages[tab]})

    if (code === 0) {
      let temp = [...data]
      temp[tab] = result
      setData(temp)
      // console.log(data)
    }
  }

  const onTab = (i) => {
    setTab(i)
  }

  useEffect(() => {
    onSearch(form.getFieldsValue(), pages[tab].pageNo)
  }, [tab])

  const onPage = (page) => {
    const values = form.getFieldsValue()
    onSearch(values, page)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Search {...{onSearch, channels, products, form, tab}} />
        <div style={{background: '#fff'}}>
          <Tabs tabBarStyle={{paddingLeft: 30}} onChange={onTab}>
            {tabs.map((v, i) => (
              <TabPane tab={v} key={i}>
                <TableList
                  tab={i}
                  data={data[i]}
                  columns={columns[i]}
                  onPage={onPage}
                  rowKey={(record) => record.dueDate + Math.random()}
                />
              </TabPane>
            ))}
          </Tabs>
        </div>
      </Space>
    </Layout>
  )
}

body.getInitialProps = async () => {
  try {
    const [
      {
        data: {code: amountCode, data: amountList = {}},
      },
      {
        data: {code: countCode, data: countList = {}},
      },
      {
        data: {data: channels = []},
      },
      {
        data: {data: products = []},
      },
    ] = await Promise.all([
      fetchList(urls[0], {
        startDate,
        endDate,
        ...pages[0],
      }),
      fetchList(urls[1], {
        startDate,
        endDate,
        ...pages[1],
      }),
      biFetch('/common/allChannel'),
      biFetch('/common/allProduct'),
    ])

    // console.log(channels)

    return {
      list: [amountList, countList],
      channels,
      products,
    }
  } catch (e) {
    console.log(e)
  }
  return {
    list: [{}, {}],
    channels: [],
    products: [],
  }
}

export default body
