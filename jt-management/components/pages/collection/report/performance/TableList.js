import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableList = ({
  list,
  onPage,
  companys,
  pageParams,
  collectionLevels,
  collectionProducts,
}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '催收员账号',
      dataIndex: 'accountId',
      width: 150,
    },
    {
      title: '催收员',
      dataIndex: 'accountName',
      width: 150,
    },
    {
      title: 'D10+',
      dataIndex: 'overdueTenDayAchievement',
      width: 150,
    },
    {
      title: 'D30+',
      dataIndex: 'overdueThirtyDayAchievement',
      width: 150,
    },
    {
      title: 'D60+',
      dataIndex: 'overdueSixtyDayAchievement',
      width: 150,
    },
    {
      title: 'D90+',
      dataIndex: 'overdueNinetyDayAchievement',
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
    current: pageParams.page,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.page = pageNumber
      onPage()
    },
  }

  return (
    <Table
      rowKey="rowKey"
      dataSource={list.list}
      columns={columns}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
