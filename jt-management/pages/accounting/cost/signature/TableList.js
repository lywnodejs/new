import React, {useEffect, useState} from 'react'
import {Table, Button, Card} from 'antd'
import Router from 'next/router'

const TableList = ({list, totalData, onPage, pageParams}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '日期',
      dataIndex: 'statDate',
      key: 'statDate',
      width: 150,
    },
    {
      title: '机构',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 150,
    },
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
    },
    {
      title: '成本',
      dataIndex: 'cost',
      key: 'cost',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },
    {
      title: '调用量',
      dataIndex: 'num',
      key: 'num',
      width: 150,
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
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
