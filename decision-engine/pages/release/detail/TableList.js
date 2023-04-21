import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table, Button} from 'antd'

const BaseVariableTableList = ({list, onPage, pageParams}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '修改类型',
      dataIndex: 'modifyType',
      key: 'modifyType',
      width: 150,
    },
    {
      title: '规则编号',
      dataIndex: 'diffEntryCode',
      key: 'diffEntryCode',
      width: 150,
    },
    {
      title: '原规则',
      dataIndex: 'oldValue',
      key: 'oldValue',
      width: 150,
    },
    {
      title: '新规则',
      dataIndex: 'newValue',
      key: 'newValue',
      width: 150,
    },
    {
      title: '原状态',
      dataIndex: 'oldUseStatus',
      key: 'oldUseStatus',
      width: 150,
    },
    {
      title: '新状态',
      dataIndex: 'newUseStatus',
      key: 'newUseStatus',
      width: 150,
    },
    {
      title: '修改时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
      width: 150,
    },
    {
      title: '修改人',
      dataIndex: 'modifyUser',
      key: 'modifyUser',
      width: 150,
    },
  ]

  const onShowSizeChange = (current, pageSize) => {
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: list.total,
    pageSize: pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    onShowSizeChange: onShowSizeChange,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNo = pageNumber
      onPage()
    },
  }

  return (
    <Table
      rowKey="id"
      dataSource={list.list}
      columns={columns}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default BaseVariableTableList
