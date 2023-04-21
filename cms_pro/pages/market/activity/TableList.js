import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableList = ({list, total, onPage, pageParams, publishOrEnd}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const style = {marginLeft: 10}
  const columns = [
    {
      title: '活动编号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },

    {
      title: '活动链接',
      dataIndex: 'link',
      key: 'link',
      width: 150,
    },
    {
      title: '活动时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 150,
      render: (record, row) => {
        return (
          <span>
            {row.startTime} - {row.endTime}
          </span>
        )
      },
    },
    {
      title: '活动状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'surplusPayableAmount',
      key: 'surplusPayableAmount',
      width: 180,
      render: (record, row) => {
        return (
          <span>
            {row.status == '进行中' ? (
              <a onClick={() => publishOrEnd(row)}>结束</a>
            ) : row.status == '未发布' ? (
              <a onClick={() => publishOrEnd(row)}>发布</a>
            ) : null}
            <a style={style} onClick={() => edit(row)}>
              编辑
            </a>
            <a
              style={style}
              onClick={() => {
                recordList(row)
              }}
            >
              获奖名单
            </a>
          </span>
        )
      },
    },
  ]

  const edit = (row) => {
    Router.push(`/market/activity/detail?id=${row.id}`)
  }
  const recordList = (row) => {
    Router.push(`/market/activity/winnersList?id=${row.id}&name=${row.name}`)
  }

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: total,
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
