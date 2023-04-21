import React, {useEffect, useState} from 'react'
import {Table, Button, Card} from 'antd'
import Router from 'next/router'

const TableList = ({list, onPage, pageParams, totalData, newBusinessList}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '日期',
      dataIndex: 'statDate',
      key: 'statDate',
      width: 150,
    },
    {
      title: '商户名称',
      dataIndex: 'channelId',
      key: 'channelId',
      width: 150,
      render: (text, record, index) => {
        let findOne = newBusinessList.find((one) => one.id == text)
        return findOne ? findOne.name : '-'
      },
    },

    {
      title: '五要素验证单价',
      dataIndex: 'price',
      key: 'price',
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
      title: '五要素验证调用量',
      dataIndex: 'num',
      key: 'num',
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
      rowKey={(record) => record.price + Math.random()}
      columns={columns}
      dataSource={list}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
