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

const breadcrumbs = [{text: 'BI报表'}, {text: '贷后分析'}, {text: '不良率报表'}]

const tabs = ['月度', '季度', '半年度', '年度']

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

const startDate = moment().subtract(1, 'Y').format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

const fetchList = async (
  params = {
    startDate,
    endDate,
    bucket: 1,
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

  return await biFetch('/nonPerforming/rate', {
    startDate,
    endDate,
    ...params,
  })
}

const columns = [
  {
    title: '放款时间',
    dataIndex: 'grantBucket',
    align: 'left',
  },
  {
    title: '渠道',
    dataIndex: 'srcChannel',
    align: 'left',
  },
  {
    title: '不良金额(元)',
    dataIndex: 'nonPerAmt',
    align: 'left',
  },
  {
    title: '不良率',
    dataIndex: 'nonPerRate',
    align: 'left',
  },
  {
    title: '次级金额(元)',
    dataIndex: 'juniorAmt',
    align: 'left',
  },
  {
    title: '可疑金额(元)',
    dataIndex: 'suspectAmt',
    align: 'left',
  },
  {
    title: '损失金额(元)',
    dataIndex: 'lossAmt',
    align: 'left',
  },
  {
    title: '次级率',
    dataIndex: 'juniorRate',
    align: 'left',
  },
  {
    title: '可疑率',
    dataIndex: 'suspectRate',
    align: 'left',
  },
  {
    title: '损失率',
    dataIndex: 'lossRate',
    align: 'left',
  },
]

const TableList = ({
  onPage,
  data: {extra = [], list = [], pageRet = {}},
  columns = [],
  tab,
}) => {
  const onShowSizeChange = (current, size) => {
    console.log(current, size)
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
    />
  )
}

const DownloadCSV = ({form}) => {
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

const Search = ({onSearch, channels, products, form}) => {
  return (
    <Form
      layout="inline"
      form={form}
      initialValues={{
        date: [moment(startDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')],
        srcCode: '',
        bucket: 1,
        productId: '',
      }}
      onFinish={onSearch}
      className="searchForm"
    >
      <Form.Item
        label="放款日"
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

      <Form.Item hidden name="bucket">
        <Input />
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
  let [data, setData] = useState(list)
  let [tab, setTab] = useState(0)

  const onSearch = async (values, pageNo = 1) => {
    // console.log(values)
    pages[tab].pageNo = pageNo
    const {
      data: {code, data},
    } = await fetchList({...values, ...pages})

    if (code === 0) {
      setData(data)
    }
  }

  const onPage = (page) => {
    const values = form.getFieldsValue()
    onSearch(values, page)
  }

  const onTab = (i) => {
    console.log(i)
    setTab(i)
    form.setFieldsValue({bucket: parseInt(i) + 1})
    // form.submit()
    onPage(pages[tab].pageNo)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Search {...{onSearch, channels, products, form}} />
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
        data: {code, data: list = {}},
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
    list: {},
    channels: [],
    products: [],
  }
}

export default body
