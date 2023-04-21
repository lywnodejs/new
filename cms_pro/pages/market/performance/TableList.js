import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableList = ({list, onPage, pageParams, totalData}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const columns = [
    {
      title: '客户经理手机号',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 150,
    },
    {
      title: '工号',
      dataIndex: 'jobNumber',
      key: 'jobNumber',
      width: 150,
    },

    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '贷款调查单数',
      dataIndex: 'investCount',
      key: 'investCount',
      width: 150,
    },
    {
      title: '贷后检查单数',
      dataIndex: 'inspectCount',
      key: 'inspectCount',
      width: 150,
    },
    {
      title: '累计放款额',
      dataIndex: 'grantAmount',
      key: 'grantAmount',
      width: 150,
    },
    {
      title: '累计管户数',
      dataIndex: 'userCount',
      key: 'userCount',
      width: 150,
    },
    {
      title: '管户当月实收利息总收入',
      dataIndex: 'interestAmount',
      key: 'interestAmount',
      width: 180,
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
      title: '当月发放绩效金额',
      dataIndex: 'allRewardAmount',
      key: 'allRewardAmount',
      width: 150,
      fixed: 'right',
    },
  ]

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: totalData,
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
      style={{marginTop: 20}}
      rowKey="id"
      columns={columns}
      dataSource={list}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
