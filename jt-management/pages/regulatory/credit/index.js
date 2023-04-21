import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import apiRegulatory from '~/api/regulatory'
import {Table} from 'antd'
import {REPORT_TYPE} from '~/utils/const'

import SearchForm from './searchForm'
import ImportData from './importData'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = pageParams) => {
  try {
    let {
      data: {code, data},
    } = await apiRegulatory.getCreditReportList(params)
    if (code == 0) {
      return data
    }
    return {
      totalSize: 0,
      list: [],
    }
  } catch (e) {
    return {
      totalSize: 0,
      list: [],
    }
  }
}

const breadcrumbs = [{text: '监管报送'}, {text: '征信报送'}]

function body(props) {
  const [data, setData] = useState(props.data)
  const [allCategory, setAllCategory] = useState([])
  const [searchParams, setSearchParams] = useState({})
  const [allProducts, setAllProducts] = useState([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    getCategory()
    getAllProducts()
  }, [])

  const getCategory = () => {
    apiRegulatory.getCategory('credit_report').then(({data: {data, code}}) => {
      if (code == 0) {
        setAllCategory(data)
      }
    })
  }

  const getAllProducts = () => {
    apiRegulatory.getAllProducts().then(({data: {data, code}}) => {
      if (code == 0) {
        setAllProducts(data)
      }
    })
  }

  const onSearch = ({time, ...params}) => {
    setSearchParams(params)
    pageParams.pageNo = 1
    updateList({...params, ...pageParams})
  }

  const onChangePage = (pageNo = pageParams.pageNo) => {
    pageParams.pageNo = pageNo
    updateList({...searchParams, ...pageParams})
  }

  const updateList = async (params) => {
    let data = await getData({...params})
    setData(data)
  }

  const columns = [
    {title: '借据号', dataIndex: 'orderNum'},
    {title: '手机号', dataIndex: 'mobilePhone'},
    {title: '债务人名称', dataIndex: 'userName'},
    {title: '债务人身份标识号码', dataIndex: 'idCard'},
    {title: '产品名称', dataIndex: 'productName'},
    {title: '信息记录类型', dataIndex: 'reportInfoType'},
    {title: '信息记录事件', dataIndex: 'eventName'},
    {title: '应上报日期', dataIndex: 'needReportDate'},
    {
      title: '上报标识',
      dataIndex: 'reportStatus',
      render: (val) => {
        const item = REPORT_TYPE.find((v) => v.key == val)
        return (item && item.name) || ''
      },
    },
  ].map((v) => {
    v.align = 'center'
    return v
  })

  const paginationConfig = {
    total: data.totalSize,
    current: pageParams.pageNo,
    showSizeChanger: false,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
    onChange: onChangePage,
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <SearchForm
        search={onSearch}
        importData={setVisible}
        allCategory={allCategory}
        allProducts={allProducts}
      />

      <Table
        bordered
        rowKey={(v, i) => i}
        pagination={paginationConfig}
        columns={columns}
        dataSource={data.list || []}
      />
      <ImportData setVisible={setVisible} visible={visible} />
    </Layout>
  )
}

body.getInitialProps = async (ctx) => {
  let data = await getData()
  return {data}
}

export default body
