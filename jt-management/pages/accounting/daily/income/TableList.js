import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'

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
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
    },
    {
      title: '利息收入',
      dataIndex: 'intAmount',
      key: 'intAmount',
      width: 150,
    },
    {
      title: '总应收',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
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
      title: '总实收',
      dataIndex: 'finishTotalAmount',
      key: 'finishTotalAmount',
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
      title: '应收本金',
      dataIndex: 'capital',
      key: 'capital',
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
      title: '应收利息',
      dataIndex: 'interest',
      key: 'interest',
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
      title: '应收罚息',
      dataIndex: 'penalty',
      key: 'penalty',
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
      title: '实收本金',
      dataIndex: 'finishCapital',
      key: 'finishCapital',
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
      title: '实收利息',
      dataIndex: 'finishInterest',
      key: 'finishInterest',
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
      title: '实收罚息',
      dataIndex: 'finishPenalty',
      key: 'finishPenalty',
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
    // {
    //   title: '资产转让',
    //   dataIndex: 'transferAmount',
    //   key: 'transferAmount',
    //   width: 150,
    //   render: (record) => {
    //     if (record == null) {
    //       return null
    //     } else {
    //       let str = Number(record).toLocaleString()
    //       return str
    //     }
    //   },
    // },
    // {
    //   title: '核销回收',
    //   dataIndex: 'cancelAmount',
    //   key: 'cancelAmount',
    //   width: 150,
    //   render: (record) => {
    //     if (record == null) {
    //       return null
    //     } else {
    //       let str = Number(record).toLocaleString()
    //       return str
    //     }
    //   },
    // },
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
