import React, {useEffect, useState} from 'react'
import {Table} from 'antd'

const TableList = ({list, totalData, onPage, pageParams, assetSideList}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '日期',
      dataIndex: 'statDate',
      key: 'statDate',
      width: 150,
    },
    {
      title: '资产方',
      dataIndex: 'comanyId',
      key: 'comanyId',
      width: 150,
      render: (text, record, index) => {
        let findOne = assetSideList.find((one) => one.code == text)
        return findOne ? findOne.description : '-'
      },
    },
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
    },
    {
      title: '贷款余额',
      dataIndex: 'loanBalance',
      key: 'loanBalance',
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
      title: '息费发生额',
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
      title: '应分润额',
      dataIndex: 'profit',
      key: 'profit',
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
