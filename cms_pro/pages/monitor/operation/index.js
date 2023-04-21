import {useEffect, useState, useRef} from 'react'
import {Layout} from '~/components/Layout'
import {Button, DatePicker, Form, Select, Table, Space} from 'antd'

import nextId from 'react-id-generator'

import moment from 'moment'
import {biFetch} from '~/utils/fetch'
import {CSVLink} from 'react-csv'

const {RangePicker} = DatePicker
const {Option} = Select

const breadcrumbs = [{text: '资产监控报表'}, {text: '运营分析'}]

const pages = {
  pageNo: 1,
  pageSize: 20,
}

const startDate = moment().subtract(8, 'days').format('YYYY-MM-DD')
const endDate = moment().subtract(1, 'days').format('YYYY-MM-DD')

const columns = [
  {title: '申请日期', dataIndex: 'statDate', width: 100},
  {
    title: '渠道',
    dataIndex: 'srcChannel',
    width: 100,
    render: (v) => {
      return !v ? '全部' : v
    },
  },
  {title: '进件客户数', dataIndex: 'applyUser', width: 150},
  {title: '授信成功客户数', dataIndex: 'applySuccessUser', width: 150},
  {title: '授信拒绝客户数', dataIndex: 'applyRejectUser', width: 150},
  {title: '授信失败客户数', dataIndex: 'applyFailUser', width: 150},
  {
    title: '授信成功率',
    dataIndex: 'applySuccessRate',
    width: 150,
  },
  {title: '首次用信笔数', dataIndex: 'firstLoanCnt', width: 150},
  {
    title: '首次用信比例',
    dataIndex: 'firstLoanRate',
    width: 150,
  },
  {title: '首次用信通过笔数', dataIndex: 'firstLoanSuccessCnt'},
  {
    title: '首次用信拒绝笔数',
    dataIndex: 'firstLoanRejectCnt',
  },
  {
    title: '首次用信通过率',
    dataIndex: 'firstLoanSuccessRate',
  },
  {title: '复借用信笔数', dataIndex: 'reLoanCnt'},
  {title: '复借用信通过笔数', dataIndex: 'reLoanSuccessCnt'},
  {
    title: '复借用信通过率',
    dataIndex: 'reLoanSuccessRate',
  },
  {
    title: '总授信金额(元)',
    dataIndex: 'totalApplySuccessAmt',
  },
  {title: '总授信客户数', dataIndex: 'totalApplySuccessUser'},
  {
    title: '平均授信金额(元)',
    dataIndex: 'avgApplySuccessAmt',
  },
  {title: '首次用信放款金额(元)', dataIndex: 'firstLoanGrantAmt'},
  {title: '首次用信放款笔数', dataIndex: 'firstLoanGrantCnt'},
  {
    title: '首次用信平均放款金额(元)',
    dataIndex: 'avgFirstLoanGrantAmt',
  },
  {title: '复借用信放款金额(元)', dataIndex: 'reLoanGrantAmt'},
  {title: '复借用信放款笔数', dataIndex: 'reLoanGrantCnt'},
  {
    title: '复借用信平均放款金额(元)',
    dataIndex: 'avgReLoanGrantAmt',
  },
]

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

  return biFetch('/operate/analysis/query', {
    startDate,
    endDate,
    ...params,
  })
}

export const TableList = ({
  onPage,
  data: {extra = [], list = [], pageRet = {}},
  columns = [],
}) => {
  const onShowSizeChange = (current, size) => {
    console.log(current, size)
    pagination.pageSize = size
  }

  const pagination = {
    position: 'bottom',
    total: pageRet.totalCount,
    pageSize: pages.pageSize,
    showTotal: (total) => `共 ${pageRet.totalCount} 条记录`,
    onChange: onPage,
    onShowSizeChange,
  }
  return (
    <Table
      rowKey={nextId}
      dataSource={list}
      columns={columns}
      pagination={pagination}
      scroll={{x: 4500, y: 'calc(100vh - 350px)'}}
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

export const Search = ({onSearch, channels, products, form}) => {
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
        <DownloadCSV {...{form}} />
      </Form.Item>
    </Form>
  )
}

const body = ({list, channels, products}) => {
  const [form] = Form.useForm()
  let [data, setData] = useState(list)

  const onSearch = async (values) => {
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
        <TableList data={data} columns={columns} />
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
