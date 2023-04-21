import {useEffect, useState, useRef} from 'react'
import {Layout} from '~/components/Layout'
import {Button, DatePicker, Form, Select, Table, Space} from 'antd'

import moment from 'moment'
import {biFetch} from '~/utils/fetch'
import {CSVLink} from 'react-csv'

import {Search, TableList} from '../ratio'

const breadcrumbs = [
  {text: 'BI报表'},
  {text: '贷中分析'},
  {text: '用信客户额度使用率报表'},
]

const {RangePicker} = DatePicker
const {Option} = Select

const pages = {
  pageNo: 1,
  pageSize: 20,
}

const startDate = moment().subtract(6, 'M').format('YYYY-MM-DD')
const endDate = moment().format('YYYY-MM-DD')

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

  return await biFetch('/loan/mid/analysis/loanUserQuotaUseRate', {
    startDate,
    endDate,
    ...params,
  })
}

const columns = [
  {
    title: '授信时间',
    dataIndex: 'creditDate',
    align: 'left',
    fixed: 'left',
  },
  {
    title: '渠道',
    dataIndex: 'srcChannel',
    align: 'left',
    fixed: 'left',
  },
  {
    title: '授信金额(元)',
    dataIndex: 'creditAmt',
    align: 'left',
    fixed: 'left',
  },
]

for (var i = 0; i < 13; i++) {
  columns.push({
    title: `MOB${i}`,
    dataIndex: `mob${i}`,
    align: 'left',
  })
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
        <TableList
          onShowSizeChange={onShowSizeChange}
          data={data}
          columns={columns}
          onPage={onPage}
          pages={pages}
        />
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
