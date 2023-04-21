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
      title: '其他债务人名称',
      dataIndex: 'billIds',
      key: 'billIds',
      width: 150,
    },
    {
      title: '其他债务人身份标识类型',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 150,
    },
    {
      title: '其他债务人身份标识号码',
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
