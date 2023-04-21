import React, {useEffect, useState} from 'react'
import {Table} from 'antd'

const TableList = ({list, onPage, pageParams, totalData, productList}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '放款日期',
      dataIndex: 'statDate',
      key: 'statDate',
      fixed: 'left',
    },
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '进件渠道',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '贷款发放金额',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '贷款收回金额（本金）',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '待收本金',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '逾期本金',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '逾期率',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '逾期30+本金',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '逾期30+不良率',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '逾期60+本金',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '逾期60+不良率',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '逾期90+本金',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: '逾期90+不良率',
      dataIndex: 'productName',
      key: 'productName',
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
    current: pageParams.pageNum,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNum = pageNumber
      onPage()
    },
  }

  return (
    <Table
      style={{marginTop: 20}}
      rowKey={(record) => record.statDate + Math.random()}
      columns={columns}
      dataSource={list}
      bordered
      pagination={pagination}
      scroll={{x: 'max-content'}}
    />
  )
}

export default TableList
