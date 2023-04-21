import {useEffect, useState, useRef} from 'react'
import {Layout} from '~/components/Layout'
import {Button, DatePicker, Form, Select, Table, Space, Tabs, Input} from 'antd'
import nextId from 'react-id-generator'
import moment from 'moment'
import {biFetch} from '~/utils/fetch'
import {CSVLink} from 'react-csv'

const {RangePicker} = DatePicker
const {Option} = Select
const {TabPane} = Tabs

const breadcrumbs = [{text: 'BI报表'}, {text: '贷后分析'}, {text: '逾期率报表'}]

const tabs = ['M0+', 'M1+', 'M2+', 'M3+']

const pages = [
  {
    pageNo: 1,
    pageSize: 20,
  },
  {
    pageNo: 1,
    pageSize: 20,
  },
  {
    pageNo: 1,
    pageSize: 20,
  },
  {
    pageNo: 1,
    pageSize: 20,
  },
]

const startDate = moment().subtract(1, 'M').format('YYYY-MM')
const endDate = moment().format('YYYY-MM')

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
    ? moment(params.date[0]).format('YYYY-MM')
    : undefined
  const endDate = Array.isArray(params.date)
    ? moment(params.date[1]).format('YYYY-MM')
    : undefined

  delete params.date

  return await biFetch('/overdue/stat/rate', {
    startDate,
    endDate,
    type: tabs[0],
    ...params,
  })
}

const columns = [
  {
    title: '放款月份',
    dataIndex: 'grantMonth',
    align: 'left',
    width: 100,
    fixed: 'left',
  },
  {
    title: '渠道',
    dataIndex: 'srcChannel',
    align: 'left',
    width: 80,
    fixed: 'left',
  },
  {
    title: '放款金额(元)',
    dataIndex: 'grantAmount',
    align: 'left',
    width: 120,
    fixed: 'left',
    render: (value) => value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'),
  },
]

for (var i = 1; i < 25; i++) {
  columns.push({
    title: `MOB${i}`,
    dataIndex: `mob${i}`,
    align: 'left',
    width: 100,
  })
}

const TableList = ({
  onPage,
  data: {extra = [], list = [], pageRet = {}},
  columns = [],
  tab,
}) => {
  const onShowSizeChange = (current, size) => {
    // console.log(current, size)
    pages[tab].pageSize = size
  }

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
      rowKey={() => nextId()}
      dataSource={list}
      columns={columns}
      pagination={pagination}
      scroll={{x: 1500}}
    />
  )
}

const DownloadCSV = ({form, fetchList}) => {
  const csvInstance = useRef()
  const [data, setData] = useState({})
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

  let headers = columns.map((column) => ({
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

const Search = ({onSearch, channels, products, form, fetchList}) => {
  return (
    <Form
      layout="inline"
      form={form}
      initialValues={{
        date: [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')],
        srcCode: '',
        productId: '',
        type: tabs[0],
      }}
      onFinish={onSearch}
      className="searchForm"
    >
      <Form.Item
        label="放款月份"
        name="date"
        {...{
          rules: [{type: 'array', required: true, message: '请选时间!'}],
        }}
      >
        <RangePicker picker="month" />
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

      <Form.Item hidden name="type">
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          查询
        </Button>
      </Form.Item>

      <Form.Item>
        <DownloadCSV {...{form, fetchList}} />
      </Form.Item>
    </Form>
  )
}

const body = ({list, channels, products}) => {
  const [form] = Form.useForm()
  const [data, setData] = useState(list)
  const [tab, setTab] = useState(0)

  const onSearch = async (values, pageNo = 1) => {
    // console.log(values)
    pages[tab].pageNo = pageNo
    const {
      data: {code, data},
    } = await fetchList({...values, ...pages[tab]})

    if (code === 0) {
      setData(data)
    }
  }

  const onPage = (page) => {
    const values = form.getFieldsValue()
    onSearch(values, page)
  }

  const onTab = (i) => {
    setTab(i)
    form.setFieldsValue({type: tabs[i]})
    onPage(pages[tab].pageNo)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Search {...{onSearch, channels, products, form, fetchList}} />
        <div style={{background: '#fff'}}>
          <Tabs tabBarStyle={{paddingLeft: 30}} onChange={onTab}>
            {tabs.map((v, i) => (
              <TabPane tab={v} key={i}>
                <TableList
                  tab={i}
                  data={data}
                  columns={columns}
                  onPage={onPage}
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

    // console.log(list, channels)

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
