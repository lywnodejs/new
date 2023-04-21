import React, {useEffect, useState} from 'react'
import {Table, Button, Card} from 'antd'

const TableList = ({list, onPage, totalData, pageParams, productList}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '放款月份',
      dataIndex: 'loanDate',
      key: 'loanDate',
      width: 180,
      fixed: 'left',
    },
    {
      title: '产品名',
      dataIndex: 'productId',
      key: 'productId',
      width: 180,
      render: (text, record, index) => {
        let findOne = productList.find((one) => one.id == text)
        return findOne ? findOne.name : ''
      },
    },
    {
      title: '信审员',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 180,
    },
    {
      title: '放款金额（元）',
      dataIndex: 'loanAmount',
      key: 'loanAmount',
      width: 180,
    },
    {
      title: '逾期金额（元）',
      dataIndex: 'overdueAmount',
      key: 'overdueAmount',
      width: 180,
    },
    {
      title: '逾期率',
      dataIndex: 'overdueRate',
      key: 'overdueRate',
      width: 180,
    },
    {
      title: '当月发放(元)',
      dataIndex: 'currentGrant',
      key: 'currentGrant',
      width: 180,
    },
    {
      title: '下一年度的当月发放(元)',
      dataIndex: 'nextCurrentGrant',
      key: 'nextCurrentGrant',
      width: 180,
    },
    {
      title: '下下一年度的当月发放(元)',
      dataIndex: 'afterNextCurrentGrant',
      key: 'afterNextCurrentGrant',
      width: 180,
    },
    {
      title: '本年度终了发放(元)',
      dataIndex: 'currentYearEnd',
      key: 'currentYearEnd',
      width: 180,
    },
  ]

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: totalData.total,
    pageSize: pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNo = pageNumber
      onPage()
    },
  }
  return (
    <Card>
      <Table
        style={{marginTop: 20}}
        rowKey="id"
        columns={columns}
        dataSource={list}
        bordered
        pagination={pagination}
        scroll={{y: '100%', x: '100%'}}
      />
    </Card>
  )
}

export default TableList
