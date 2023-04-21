import React, {useEffect, useState} from 'react'
import {Table, Button, Card} from 'antd'
import Router from 'next/router'

const TableList = ({
  list,
  totalData,
  onPage,
  pageParams,
  productList,
  channelData,
  vertifyStatusList,
}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '信审单号',
      dataIndex: 'creditNum',
      key: 'creditNum',
      width: 180,
      fixed: 'left',
    },
    {
      title: '产品名称',
      dataIndex: 'productType',
      key: 'productType',
      width: 180,
      render: (text, record, index) => {
        let findOne = productList.find((one) => one.id == text)
        return findOne ? findOne.name : ''
      },
    },
    {
      title: '渠道',
      dataIndex: 'addChannel',
      key: 'addChannel',
      width: 180,
      render: (text, record, index) => {
        let findOne = channelData.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },

    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      width: 180,
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      key: 'userPhone',
      width: 180,
    },

    {
      title: '人审流程',
      dataIndex: 'creditFlow',
      key: 'creditFlow',
      width: 180,
      render: (text) => {
        switch (text) {
          case 1:
            return '初审-复核-终审'
          case 2:
            return '初审-终审'
          case 3:
            return '终审'
        }
      },
    },
    {
      title: '授信日期',
      dataIndex: 'orderTime',
      key: 'orderTime',
      width: 180,
    },
    {
      title: '结案日期',
      dataIndex: 'orderFinishTime',
      key: 'orderFinishTime',
      width: 180,
    },
    {
      title: '总时长',
      dataIndex: 'waitOverallHours',
      key: 'waitOverallHours',
      width: 180,
    },
    {
      title: '审核状态',
      dataIndex: 'verifyStatus',
      key: 'verifyStatus',
      width: 180,
      render: (text, record, index) => {
        let findOne = vertifyStatusList.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '操作',
      dataIndex: 'CZ',
      key: 'CZ',
      width: 180,
      fixed: 'right',
      render: (record, row) => {
        return <a onClick={() => checkDetail(row)}>详情</a>
      },
    },
  ]
  const checkDetail = (record) => {
    let url = `/credit/examine/detail?creditId=${record.creditId}&orderId=${record.orderId}`
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
        rowKey={(record) => record.orderTime + Math.random()}
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
