import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'

const TableListOne = ({}) => {
  const columns = [
    {
      title: '身份类别',
      dataIndex: 'accountTime',
      key: 'accountTime',
      width: 150,
    },
    {
      title: '责任人名称',
      dataIndex: 'billIds',
      key: 'billIds',
      width: 150,
    },
    {
      title: '责任人身份标识类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 150,
    },
    {
      title: '责任人身份标识号码',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
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
      title: '还款责任人类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 150,
    },
    {
      title: '还款责任人金额（元）',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 150,
    },
    {
      title: '联保标志',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 150,
    },
  ]

  return (
    <Table
      rowKey="id"
      //   dataSource={paymentRecord}
      columns={columns}
      bordered
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableListOne
