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
      title: '初审中',
      dataIndex: 'firstCount',
      key: 'firstCount',
      width: 180,
    },
    {
      title: '初审通过',
      dataIndex: 'firstPassCount',
      key: 'firstPassCount',
      width: 180,
    },
    {
      title: '初审拒绝',
      dataIndex: 'firstDenyCount',
      key: 'firstDenyCount',
      width: 180,
    },
    {
      title: '复核中',
      dataIndex: 'recheckCount',
      key: 'recheckCount',
      width: 180,
    },

    {
      title: '复核完成',
      dataIndex: 'recheckFinishCount',
      key: 'recheckFinishCount',
      width: 180,
    },
    {
      title: '终审中',
      dataIndex: 'firstCount',
      key: 'firstCount',
      width: 180,
    },
    {
      title: '终审完成',
      dataIndex: 'finalFinishCount',
      key: 'finalFinishCount',
      width: 180,
    },
    {
      title: '总计',
      dataIndex: 'total',
      key: 'total',
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
