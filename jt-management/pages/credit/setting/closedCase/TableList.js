import React, {useEffect, useState} from 'react'
import {Table, Button, Card} from 'antd'

const TableList = ({list, totalData, onPage, pageParams, productList}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '信审员',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 180,
    },
    {
      title: '信审人工拒绝',
      dataIndex: 'denyCount',
      key: 'denyCount',
      width: 180,
    },
    {
      title: '信审人工通过',
      dataIndex: 'passCount',
      key: 'passCount',
      width: 180,
    },
    {
      title: '总计',
      dataIndex: 'total',
      key: 'total',
      width: 180,
    },
    {
      title: '通过率',
      dataIndex: 'passRateStr',
      key: 'passRateStr',
      width: 180,
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
    <Card>
      <Table
        style={{marginTop: 20}}
        rowKey="id"
        columns={columns}
        dataSource={list}
        bordered
        pagination={pagination}
        scroll={{y: '100%', x: '100%'}}
      />
    </Card>
  )
}

export default TableList
