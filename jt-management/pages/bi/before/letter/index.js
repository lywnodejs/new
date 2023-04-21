import {useEffect, useState, useRef} from 'react'
import {Layout} from '~/components/Layout'
import {Button, DatePicker, Form, Select, Table, Space} from 'antd'

import moment from 'moment'
import {biFetch} from '~/utils/fetch'
import {CSVLink} from 'react-csv'

import {Search, TableList} from '../credit'

const breadcrumbs = [
  {text: 'BI报表'},
  {text: '贷前分析'},
  {text: '用信比例报表'},
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

  return await biFetch('/loan/pre/analysis/loanRate', {
    startDate,
    endDate,
    ...params,
  })
}

const columns = [
  {
    title: '申请日期',
    dataIndex: 'applyDate',
    align: 'left',
  },
  {
    title: '渠道',
    dataIndex: 'srcChannel',
    align: 'left',
  },
  {
    title: '申请用信笔数',
    dataIndex: 'loanCnt',
    align: 'left',
  },
  {
    title: '申请用信通过笔数',
    dataIndex: 'loanSuccessCnt',
    align: 'left',
  },
  {
    title: '申请用信拒绝笔数',
    dataIndex: 'loanRejectCnt',
    align: 'left',
  },
  {
    title: '申请用信拒绝率',
    dataIndex: 'loanRejectRate',
    align: 'left',
  },
]

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
    console.log(current, size)
    pages.pageSize = size
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Space direction="vertical" size="large" style={{width: '100%'}}>
        <Search {...{onSearch, channels, products, form, fetchList, columns}} />
        <TableList
          onShowSizeChange={onShowSizeChange}
          onPage={onPage}
          pages={pages}
          data={data}
          columns={columns}
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
