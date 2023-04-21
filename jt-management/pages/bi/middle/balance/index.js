import {useEffect, useState, useRef} from 'react'
import {Layout} from '~/components/Layout'
import {Button, DatePicker, Form, Select, Table, Space} from 'antd'
import nextId from 'react-id-generator'
import moment from 'moment'
import {biFetch} from '~/utils/fetch'
import {CSVLink} from 'react-csv'

const breadcrumbs = [
  {text: 'BI报表'},
  {text: '贷中分析'},
  {text: '在贷余额报表'},
]

const {RangePicker} = DatePicker
const {Option} = Select

const pages = {
  pageNo: 1,
  pageSize: 20,
}

const startDate = moment().subtract(7, 'days').format('YYYY-MM-DD')
const endDate = moment().subtract(1, 'days').format('YYYY-MM-DD')

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

  return await biFetch('/loan/mid/analysis/onLoanAmount', {
    startDate,
    endDate,
    ...params,
  })
}

const columns = [
  {
    title: '报表日期',
    dataIndex: 'statDate',
    align: 'left',
  },
  {
    title: '渠道',
    dataIndex: 'srcChannel',
    align: 'left',
  },
  {
    title: '在贷人数',
    dataIndex: 'onLoanUser',
    align: 'left',
  },
  {
    title: '在贷笔数',
    dataIndex: 'onLoanCnt',
    align: 'left',
  },
  {
    title: '在贷总金额(元)',
    dataIndex: 'onLoanTotalAmt',
    align: 'left',
  },
  {
    title: '新增在贷余额(元)',
    dataIndex: 'newOnLoanAmt',
    align: 'left',
  },
  {
    title: '在贷笔均余额(元)',
    dataIndex: 'avgOnLoanAmt',
    align: 'left',
  },
  {
    title: 'M1比例',
    dataIndex: 'm1Rate',
    align: 'left',
  },
  {
    title: 'M2比例',
    dataIndex: 'm2Rate',
    align: 'left',
  },
  {
    title: 'M3比例',
    dataIndex: 'm3Rate',
    align: 'left',
  },
  {
    title: 'M3+比例',
    dataIndex: 'm3PlusRate',
    align: 'left',
  },
]

const TableList = ({
  onPage,
  data: {extra = [], list = [], pageRet = {}},
  columns = [],
}) => {
  const onShowSizeChange = (current, size) => {
    // console.log(current, size)
    pages.pageSize = size
  }

  const pagination = {
    position: 'bottom',
    current: pages.pageNo,
    total: pageRet.totalCount,
    pageSize: pages.pageSize,
    showTotal: (total) => `共 ${pageRet.totalCount} 条记录`,
    onChange: onPage,
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange,
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

const DownloadCSV = ({form, columns}) => {
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

export const Search = ({
  onSearch,
  channels,
  products,
  form,
  columns,
  startDate,
  endDate,
}) => {
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
        label="日期"
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
        <Button
          onClick={() => {
            form.resetFields()
            form.submit()
          }}
        >
          重置
        </Button>
      </Form.Item>

      <Form.Item>
        <DownloadCSV {...{form, columns}} />
      </Form.Item>
    </Form>
  )
}

const body = ({list, channels, products}) => {
  const [form] = Form.useForm()
  let [data, setData] = useState(list)

  const onSearch = async (values, pageNo = 1) => {
    pages.pageNo = pageNo
    const {
      data: {code, data},
    } = await fetchList({...values, ...pages})
    console.log(data, '---------------------------')
    if (code === 0) {
      setData(data)
    }
  }

  const onPage = (page) => {
    const values = form.getFieldsValue()
    onSearch(values, page)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Search
          {...{
            onSearch,
            channels,
            products,
            form,
            fetchList,
            columns,
            startDate,
            endDate,
          }}
        />
        <TableList data={data} columns={columns} onPage={onPage} />
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
