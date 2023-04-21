import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'

const TableListThree = ({paymentRecord}) => {
  const columns = [
    {
      title: '还款时间',
      dataIndex: 'accountTime',
      key: 'accountTime',
      width: 150,
    },
    {
      title: '对应期数',
      dataIndex: 'billIds',
      key: 'billIds',
      width: 150,
    },
    {
      title: '还款方式',
      dataIndex: 'operationType',
      key: 'operationType',
      width: 150,
    },
    {
      title: '还款总额（元）',
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
      title: '本金（元）',
      dataIndex: 'capitalAmount',
      key: 'capitalAmount',
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
      title: '利息（元）',
      dataIndex: 'interestAmount',
      key: 'interestAmount',
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
      title: '本金罚息（元）',
      dataIndex: 'penaltyAmount',
      key: 'penaltyAmount',
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
      title: '利息罚息（元）',
      dataIndex: 'penaltyExtAmount',
      key: 'penaltyExtAmount',
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
      dataSource={paymentRecord}
      columns={columns}
      bordered
      scroll={{y: '100%', x: '100%'}}
      style={{marginTop: 20}}
    />
  )
}

export default TableListThree
