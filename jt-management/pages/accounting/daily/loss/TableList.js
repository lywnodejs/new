import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'

const TableList = ({list, onPage, pageParams, totalData}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '日期',
      dataIndex: 'statDate',
      key: 'statDate',
      width: 150,
    },
    // {
    //   title: '放款总额',
    //   dataIndex: 'grantAmount',
    //   key: 'grantAmount',
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

    {
      title: '成本总额',
      dataIndex: 'costAmount',
      key: 'costAmount',
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
      title: '收入总额',
      dataIndex: 'incomeAmount',
      key: 'incomeAmount',
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
    //   title: '本金回收',
    //   dataIndex: 'capitalRecycle',
    //   key: 'capitalRecycle',
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
    {
      title: '利息收入',
      dataIndex: 'incomeInterest',
      key: 'incomeInterest',
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
      title: '罚息收入',
      dataIndex: 'incomePenalty',
      key: 'incomePenalty',
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
    //   dataIndex: 'cancelVerify',
    //   key: 'cancelVerify',
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
    {
      title: '净ROI',
      dataIndex: 'roi',
      key: 'roi',
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
