import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'
import apiRegulatory from '~/api/regulatory'
import {Table, Modal} from 'antd'
import Router from 'next/router'
import {SECOND_REPORT_TYPE} from '~/utils/const'

import SearchForm from './searchForm'

const pageParams = {
  pageNo: 1,
  pageSize: 10,
}
const getData = async (params = pageParams) => {
  try {
    let {
      data: {code, data},
    } = await apiRegulatory.getSecondReportList(params)
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

const breadcrumbs = [{text: '监管报送'}, {text: 'Ⅱ类户报送'}]

function body(props) {
  const [data, setData] = useState(props.data)
  const [allCategory, setAllCategory] = useState([])
  const [searchParams, setSearchParams] = useState({})

  useEffect(() => {
    getCategory()
  }, [])

  const getCategory = () => {
    apiRegulatory
      .getCategory('secend_level_report')
      .then(({data: {data, code}}) => {
        if (code == 0) {
          setAllCategory(data)
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
    {title: '存款人姓名', dataIndex: 'userName'},
    {title: '存款人身份证件号码', dataIndex: 'idCard'},
    {title: '手机号', dataIndex: 'mobilePhone'},
    {title: '账号', dataIndex: 'virtualAccount'},
    {title: '开户日期', dataIndex: 'createAccountAt'},
    {title: '绑定账户卡号', dataIndex: 'bindCardAccountNum'},
    {title: '绑定账户所属行', dataIndex: 'bindCardBelongBankName'},
    {title: '信息类型', dataIndex: 'reportInfoType'},
    {title: '应上报日期', dataIndex: 'needReportDate'},
    {
      title: '上报状态',
      dataIndex: 'reportStatus',
      render: (val) => {
        const item = SECOND_REPORT_TYPE.find((v) => v.key == val)
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
      <SearchForm search={onSearch} allCategory={allCategory} />

      <Table
        bordered
        rowKey={(v, i) => i}
        pagination={paginationConfig}
        columns={columns}
        dataSource={data.list || []}
      />
    </Layout>
  )
}

body.getInitialProps = async (ctx) => {
  // let data = await getData()
  return {data: {totalSize: 0, list: []}}
}

export default body
