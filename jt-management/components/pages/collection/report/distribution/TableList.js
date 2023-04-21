import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableList = ({list, onPage, companys, pageParams, collectionLevels}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '催收员账号',
      dataIndex: 'accountId',
      key: 'accountId',
      width: 150,
    },
    {
      title: '催收员',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 150,
    },
    {
      title: '已分配总数',
      dataIndex: 'totalNum',
      key: 'totalNum',
      width: 150,
    },
    {
      title: '待催总数',
      dataIndex: 'doingNum',
      key: 'doingNum',
      width: 150,
    },
  ]

  const mergeColumns = columns.concat(
    collectionLevels.map((item, i) => ({
      title: `${item.description}`,
      dataIndex: `collectionLevel-${i}`,
      key: `collectionLevel-${i}`,
      width: 150,
      render: (text, record, index) => {
        if (
          Array.isArray(record.numByLevelList) &&
          record.numByLevelList.length
        ) {
          let findOne = record.numByLevelList.find(
            (one) => one.collectionLevel == item.code,
          )
          return findOne ? findOne.num : ''
        }
      },
    })),
  )
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
      rowKey="id"
      dataSource={list.list}
      columns={mergeColumns}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
