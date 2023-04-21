import React, {useEffect, useState} from 'react'
import {Table, Button, Badge} from 'antd'
import moment from 'moment'

const TableList = ({list, onPage, pageParams}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '借据号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 150,
    },
    {
      title: '任务名',
      dataIndex: 'businessType',
      key: 'businessType',
      width: 150,
    },
    {
      title: '券ID',
      dataIndex: 'marketingNo',
      key: 'marketingNo',
      width: 150,
    },
    {
      title: '发放日期',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 150,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
      },
    },
    {
      title: '使用日期',
      dataIndex: 'useTime',
      key: 'useTime',
      width: 150,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
      },
    },
    {
      title: '过期日期',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 150,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text, record, index) => {
        return (
          <>
            <Badge
              status={
                text == 1 ? 'success' : text == 0 ? 'error' : 'processing'
              }
            />
            {text == 1 ? '已使用' : text == 0 ? '未使用' : '已过期'}
          </>
        )
      },
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

export default TableList
