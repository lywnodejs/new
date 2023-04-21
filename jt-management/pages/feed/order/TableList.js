import React, {useEffect, useState, useContext} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableList = ({
  list,
  onPage,
  productList,
  statusList,
  checkProgressList,
  applyStatusList,
  pageParams,
}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const columns = [
    // {
    //   title: '序号',
    //   dataIndex: 'id',
    //   key: 'id',
    //   width: 150,
    //   fixed: 'left',
    // },
    {
      title: '进件单号',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 150,
      fixed: 'left',
    },
    {
      title: '产品名称',
      dataIndex: 'productId',
      key: 'productId',
      width: 150,
      render: (text, record, index) => {
        let findOne = productList.find((one) => one.id == text)
        return findOne ? findOne.name : ''
      },
    },
    {
      title: '用户名',
      dataIndex: 'realName',
      key: 'realName',
      width: 150,
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      width: 150,
    },
    {
      title: '进件时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    // {
    //   title: '复审状态',
    //   dataIndex: 'checkProgress',
    //   key: 'checkProgress',
    //   width: 150,
    //   render: (text, record, index) => {
    //     let findOne = checkProgressList.find((one) => one.code == text)
    //     return findOne ? findOne.description : ''
    //   },
    // },
    {
      title: '进件状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text, record, index) => {
        let findOne = applyStatusList.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => checkDetail(record)}>
              详情
            </Button>
          </>
        )
      },
    },
  ]

  const checkDetail = (record) => {
    let url = `/feed/order/detail?id=${record.id}`
    Router.push(url)
  }
  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
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
      rowKey="orderNum"
      dataSource={list.list}
      columns={columns}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
