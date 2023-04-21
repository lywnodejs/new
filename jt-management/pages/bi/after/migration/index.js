import {useEffect, useState, useRef} from 'react'
import {Layout} from '~/components/Layout'
import {Button, DatePicker, Form, Select, Table, Space} from 'antd'
import nextId from 'react-id-generator'
import moment from 'moment'
import {biFetch} from '~/utils/fetch'
import {CSVLink} from 'react-csv'

const breadcrumbs = [{text: 'BI报表'}, {text: '贷后分析'}, {text: '迁徙率报表'}]

const {RangePicker} = DatePicker
const {Option} = Select

const pages = {
  pageNo: 1,
  pageSize: 20,
}

const startDate = moment().subtract(9, 'M').format('YYYY-MM')
const endDate = moment().subtract(2, 'M').format('YYYY-MM')
const dueDate = moment().subtract(1, 'M').format('YYYY-MM')

const fetchList = async (
  params = {
    startDate,
    endDate,
    dueDate,
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

  if (params.dueDate) {
    params.dueDate = moment(params.dueDate).format('YYYY-MM')
  }

  return await biFetch('/migration/rate', {
    startDate,
    endDate,
    ...params,
  })
}

const columns = [
  {
    title: '放款月份',
    dataIndex: 'grantMonth',
    align: 'left',
  },
  {
    title: '渠道',
    dataIndex: 'srcChannel',
    align: 'left',
  },
]

for (var i = 0; i < 7; i++) {
  columns.push({
    title: `M${i}-M${i + 1}`,
    dataIndex: `m${i}m${i + 1}`,
    align: 'left',
  })
}

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
        dueDate: moment(dueDate, 'YYYY-MM'),
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

      <Form.Item
        label="到期月份"
        name="dueDate"
        {...{
          rules: [{required: true, message: '请选时间!'}],
        }}
      >
        <DatePicker picker="month" />
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
  let [data, setData] = useState(list)

  const onSearch = async (values, pageNo = 1) => {
    pages.pageNo = pageNo
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

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Search {...{onSearch, channels, products, form, fetchList}} />
        <TableList data={data} columns={columns} onPage={onPage} />
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
