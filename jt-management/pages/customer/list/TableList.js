import React, {useEffect, useState, useContext} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableList = ({list, onPage, pageParams, totalData}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const columns = [
    {
      title: '编号',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },

    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '总授信（元）',
      dataIndex: 'creditLimitAmount',
      key: 'creditLimitAmount',
      width: 150,
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
      title: '总用信（元）',
      dataIndex: 'usedLimitAmount',
      key: 'usedLimitAmount',
      width: 150,
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
      title: '五级分类',
      dataIndex: 'fiveLevelType',
      key: 'fiveLevelType',
      width: 150,
      render: (text) => {
        switch (text) {
          case '1':
            return '正常'
          case '2':
            return '关注'
          case '3':
            return '次级'
          case '4':
            return '可疑'
          case '5':
            return '损失'
        }
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (text, record) => {
        return record ? <a onClick={() => checkDetail(record)}>详情</a> : null
      },
    },
  ]

  const checkDetail = (record) => {
    let url = `/customer/detail?id=${record.id}`
    Router.push(url)
  }

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
    current: pageParams.pageNum,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNum = pageNumber
      onPage()
    },
  }

  return (
    <Table
      rowKey={(record) => record.id}
      dataSource={list}
      columns={columns}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
