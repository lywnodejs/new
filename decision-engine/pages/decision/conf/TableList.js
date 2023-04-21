import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table} from 'antd'

const BaseVariableTableList = ({
  list,
  onPage,
  pageParams,
  appendToOrderIds,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '序号',
      dataIndex: 'operatorType',
      key: 'operatorType',
      width: 150,
    },
    {
      title: '规则编号',
      dataIndex: 'ruleCode',
      key: 'ruleCode',
      width: 150,
    },
    {
      title: '原规则',
      dataIndex: 'beforeScriptSource',
      key: 'beforeScriptSource',
      width: 150,
    },
    {
      title: '新规则',
      dataIndex: 'afterScriptSource',
      key: 'afterScriptSource',
      width: 150,
    },
    {
      title: '原状态',
      dataIndex: 'beforeUseStatus',
      key: 'beforeUseStatus',
      width: 150,
    },
    {
      title: '新状态',
      dataIndex: 'afterUseStatus',
      key: 'afterUseStatus',
      width: 150,
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '修改人',
      dataIndex: 'createUser',
      key: 'createUser',
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
      dataSource={list.result}
      columns={columns}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default BaseVariableTableList
