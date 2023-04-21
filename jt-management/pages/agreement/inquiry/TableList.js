import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table, Button, Popconfirm, message, Badge, Tooltip} from 'antd'
import api from '~/api/marketing'
const TableList = ({
  list,
  onPage,
  onDownLoadItem,
  pageParams,
  onPreview,
  appendAgreementIds,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const rowSelection = {
    selectedRowKeys,
    fixed: 'left',
    onChange: (v) => {
      setSelectedRowKeys(v)
      appendAgreementIds(v)
    },
  }

  const columns = [
    {title: '签章日期', dataIndex: 'createTime'},
    {title: '协议名称', dataIndex: 'fileName'},
    {title: '应用类型', dataIndex: 'applicationType'},
    {title: '展示页面', dataIndex: 'showPage'},
    {title: '用户手机号', dataIndex: 'phoneNumber'},
    {title: '用户名', dataIndex: 'userName'},
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => onDownLoadItem(record)}>
              下载
            </Button>
            <Button type="link" onClick={() => onPreview(record)}>
              预览
            </Button>
          </>
        )
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
    total: list.totalSize,
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
      rowSelection={rowSelection}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
