import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'

const TableList = ({list, onPage, pageParams, totalData}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '月份',
      dataIndex: 'statMonth',
      key: 'statMonth',
      width: 150,
    },
    {
      title: '截止当月总收入（元）',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
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
      title: '截止当月总成本（元）',
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
    {
      title: '截止当月总利润（元）',
      dataIndex: 'totalProfit',
      key: 'totalProfit',
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
      title: '当月利润（元）',
      dataIndex: 'currentProfit',
      key: 'currentProfit',
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
      title: '成本是否核算',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text) => {
        switch (text) {
          case 0:
            return '未核算'
          case 1:
            return '已核算'
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
      rowKey={(record) => record.statMonth + Math.random()}
      columns={columns}
      dataSource={list}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
