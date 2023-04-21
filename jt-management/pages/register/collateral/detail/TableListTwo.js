import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'

const TableListTwo = ({}) => {
  const columns = [
    {
      title: '抵押物种类',
      dataIndex: 'accountTime',
      key: 'accountTime',
      width: 180,
    },
    {
      title: '抵押物识别号类型',
      dataIndex: 'billIds',
      key: 'billIds',
      width: 180,
    },
    {
      title: '抵押物唯一识别号',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 180,
    },
    {
      title: '抵押物所在地行政区划',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      width: 180,
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
      title: '抵押物评估价值（元）',
      dataIndex: 'capitalAmount',
      key: 'capitalAmount',
      width: 180,
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
      title: '评估日期',
      dataIndex: 'interestAmount',
      key: 'interestAmount',
      width: 180,
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
      title: '抵押人身份类别',
      dataIndex: 'billIds',
      key: 'billIds',
      width: 180,
    },
    {
      title: '抵押人名称',
      dataIndex: 'billIds',
      key: 'billIds',
      width: 180,
    },
    {
      title: '抵押人身份标识类型',
      dataIndex: 'billIds',
      key: 'billIds',
      width: 180,
    },
    {
      title: '抵押人身份标识号码',
      dataIndex: 'billIds',
      key: 'billIds',
      width: 180,
    },
    {
      title: '抵押物说明',
      dataIndex: 'billIds',
      key: 'billIds',
      width: 180,
    },
  ]

  return (
    <Table
      rowKey="id"
      //   dataSource={paymentRecord}
      columns={columns}
      bordered
      scroll={{y: '100%', x: '100%'}}
      style={{marginTop: 20}}
    />
  )
}

export default TableListTwo
