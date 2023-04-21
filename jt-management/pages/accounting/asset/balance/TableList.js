import React, {useEffect, useState} from 'react'
import {Table} from 'antd'

const TableList = ({list, totalData, onPage, pageParams}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '放款日期',
      dataIndex: 'grantDate',
      key: 'grantDate',
      width: 150,
    },
    {
      title: '进件渠道',
      dataIndex: 'applySource',
      key: 'applySource',
      width: 150,
    },
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
    },
    {
      title: '待收本金',
      dataIndex: 'surplusAmount',
      key: 'surplusAmount',
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
      title: '逾期本金',
      dataIndex: 'overdueAmount',
      key: 'overdueAmount',
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
      title: '逾期率',
      dataIndex: 'overdueRate',
      key: 'overdueRate',
      width: 150,
      render: (record, text) => {
        if (record == 0) {
          return 0
        }
        let str = Number(record * 100).toFixed(2)
        str += '%'
        return str
      },
    },
    {
      title: '逾期30+本金',
      dataIndex: 'overdue30Amount',
      key: 'overdue30Amount',
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
      title: '逾期30+不良率',
      dataIndex: 'overdue30Rate',
      key: 'overdue30Rate',
      width: 150,
      render: (record, text) => {
        if (record == 0) {
          return 0
        }
        let str = Number(record * 100).toFixed(2)
        str += '%'
        return str
      },
    },
    {
      title: '逾期60+本金',
      dataIndex: 'overdue60Amount',
      key: 'overdue60Amount',
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
      title: '逾期60+不良率',
      dataIndex: 'overdue60Rate',
      key: 'overdue60Rate',
      width: 150,
      render: (record, text) => {
        if (record == 0) {
          return 0
        }
        let str = Number(record * 100).toFixed(2)
        str += '%'
        return str
      },
    },
    {
      title: '逾期90+本金',
      dataIndex: 'overdue90Amount',
      key: 'overdue90Amount',
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
      title: '逾期90+不良率',
      dataIndex: 'overdue90Rate',
      key: 'overdue90Rate',
      width: 150,
      render: (record, text) => {
        if (record == 0) {
          return 0
        }
        let str = Number(record * 100).toFixed(2)
        str += '%'
        return str
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
      rowKey={(record) => record.grantDate + Math.random()}
      columns={columns}
      dataSource={list}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
