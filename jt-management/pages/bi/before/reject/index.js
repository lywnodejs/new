import {useEffect, useState, useRef} from 'react'
import {Layout} from '~/components/Layout'
import {Button, DatePicker, Form, Select, Table, Space} from 'antd'

import moment from 'moment'
import {biFetch} from '~/utils/fetch'
import {CSVLink} from 'react-csv'

const breadcrumbs = [
  {text: 'BI报表'},
  {text: '贷前分析'},
  {text: '授信拒绝原因分布'},
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

  return await biFetch('/loan/pre/analysis/applyRejectDist', {
    startDate,
    endDate,
    ...params,
  })
}

export const TableList = ({
  onPage,
  data: {extra = [], list = [], pageRet = {}},
  pages,
  onShowSizeChange,
}) => {
  extra = extra || []
  const columns = [
    {
      title: '申请日期',
      dataIndex: 'statDate',
      align: 'left',
    },
    {
      title: '渠道',
      dataIndex: 'srcChannel',
      align: 'left',
    },
    ...extra.map((v) => {
      return {
        dataIndex: v.key,
        title: v.name,
        align: 'left',
      }
    }),
  ]

  const pagination = {
    position: 'bottom',
    current: pages.pageNo,
    total: pageRet.totalCount,
    pageSize: pages.pageSize,
    showTotal: (total) => `共 ${pageRet.totalCount} 条记录`,
    onChange: onPage,
    showSizeChanger: true,
    showQuickJumper: true,
  }
  return (
    <Table
      rowKey={(v, i) => i}
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

  let extra = data.extra || []

  let headers = [
    {label: '申请日期', key: 'statDate'},
    {label: '渠道', key: 'srcChannel'},
    ...extra.map((v) => {
      return {
        label: v.name,
        key: v.key,
      }
    }),
  ]

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

  return (
    <>
      <CSVLink
        data={data.list || []}
        headers={headers}
        ref={csvInstance}
      ></CSVLink>
      <Button loading={loading} type="primary" onClick={onDownload}>
        下载
      </Button>
    </>
  )
}

export const Search = ({onSearch, channels, products, form, fetchList}) => {
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

  const onPage = (pageNo, pageSize) => {
    pages.pageSize = pageSize
    const values = form.getFieldsValue()
    onSearch(values, pageNo)
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Search {...{onSearch, channels, products, form, fetchList}} />
        <TableList data={data} onPage={onPage} pages={pages} />
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

    console.log(list, channels)

    if (code != 0) {
      return {
        list: {},
        channels: channels || [],
        products: products || [],
      }
    }

    return {
      list: list || {},
      channels: channels || [],
      products: products || [],
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
