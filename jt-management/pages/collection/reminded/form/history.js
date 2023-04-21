import {Layout} from '~/components/Layout'
import React, {useEffect, useState} from 'react'

import api from '~/api/collection'
import apiProduct from '~/api/product'

import BaseTable from '~/components/pages/collection/reminded/form/BaseTable'
import AddContacts from '~/components/pages/collection/reminded/form/AddContacts'
import {Button, Space} from 'antd'
import AddHistory from '../../../../components/pages/collection/reminded/form/AddHistory'

const breadcrumbs = [
  {text: '催收管理'},
  {text: '待催列表'},
  {text: '催收记录详情'},
]

function body(props) {
  const [pageParams, setPageParams] = useState({pageNo: 1, pageSize: 10})

  const columns = [
    {title: '催收期数', dataIndex: 'attributeName'},
    {title: '催收方式', dataIndex: 'attributeName'},
    {title: '催收对象', dataIndex: 'attributeName'},
    {title: '联系号码', dataIndex: 'attributeName'},
    {title: '联络结果', dataIndex: 'attributeName'},
    {title: '逾期原因', dataIndex: 'attributeName'},
    {title: '还款意愿', dataIndex: 'attributeName'},
    {title: '承诺还款日期', dataIndex: 'attributeName'},
    {title: '备注', dataIndex: 'attributeName'},
    {title: '催收员', dataIndex: 'attributeName'},
    {title: '催收日期', dataIndex: 'attributeName'},
  ]

  const changePage = (pageNo, pageSize) => {
    console.log(pageNo, pageSize)
    setPageParams({
      pageNo,
      pageSize,
    })
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <BaseTable
        list={{list: [{id: 1}], total: 100}}
        pageParams={pageParams}
        changePage={changePage}
        columns={columns}
      />
    </Layout>
  )
}

body.getInitialProps = async () => {
  const backData = {
    collectionProducts: [],
    collectionLevels: [],
    urgeMethods: [],
    urgeObjects: [],
    urgeResults: [],
    urgeResultUnknows: [],
    urgeResultHighs: [],
    urgeResultLows: [],
    urgeIsConnects: [],
    urgeReasonTypes: [],
    urgeRepayDesires: [],
    connectResults: [],
    unConnectResults: [],
  }

  try {
    return backData
  } catch (err) {
    console.log(err)
    return backData
  }
}

export default body
