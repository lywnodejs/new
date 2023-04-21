import React, {useEffect, useState} from 'react'
import {Table, Button, Card} from 'antd'
const TableList = ({list, totalData, onPage, pageParams, sourthList}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '日期',
      dataIndex: 'statDate',
      key: 'statDate',
      width: 150,
    },
    {
      title: '支付通道',
      dataIndex: 'payChannel',
      key: 'payChannel',
      width: 150,
      render: (text, record, index) => {
        let findOne = sourthList.find((one) => one.code == text)
        return findOne ? findOne.description : '-'
      },
    },
    {
      title: '收款调用量',
      dataIndex: 'collNum',
      key: 'collNum',
      width: 150,
    },
    {
      title: '收款金额',
      dataIndex: 'collAmount',
      key: 'collAmount',
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
      title: '付款调用量',
      dataIndex: 'payNum',
      key: 'payNum',
      width: 150,
    },
    {
      title: '付款金额',
      dataIndex: 'payAmount',
      key: 'payAmount',
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
      title: '成本',
      dataIndex: 'totalCost',
      key: 'totalCost',
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
