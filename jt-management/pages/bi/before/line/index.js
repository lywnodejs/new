import {useEffect, useState, useRef} from 'react'
import {Layout} from '~/components/Layout'
import {Button, DatePicker, Form, Select, Table, Space} from 'antd'
import nextId from 'react-id-generator'
import moment from 'moment'
import {biFetch} from '~/utils/fetch'
import {CSVLink} from 'react-csv'

import {Search} from '../reject'

const breadcrumbs = [
  {text: 'BI报表'},
  {text: '贷前分析'},
  {text: '授信额度分布'},
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

  return await biFetch('/loan/pre/analysis/applyQuotaDist', {
    startDate,
    endDate,
    ...params,
  })
}

const TableList = ({
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
    {
      title: '授信总笔数',
      dataIndex: 'totalCreditNum',
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

  const onShowSizeChange = (current, size) => {
    // console.log(current, size)
    pages.pageSize = size
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Search {...{onSearch, channels, products, form, fetchList}} />
        <TableList
          onShowSizeChange={onShowSizeChange}
          data={data}
          pages={pages}
          onPage={onPage}
        />
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
