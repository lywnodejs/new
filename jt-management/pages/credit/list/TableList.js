import React, {useEffect, useState} from 'react'
import {Table, Button, Card} from 'antd'
import Router from 'next/router'

const TableList = ({
  list,
  onPage,
  pageParams,
  totalData,
  productList,
  vertifyStatusList,
}) => {
  const columns = [
    {
      title: '信审单号',
      dataIndex: 'creditNum',
      key: 'creditNum',
      width: 180,
      fixed: 'left',
    },
    {
      title: '订单号',
      dataIndex: 'outOrderId',
      key: 'outOrderId',
      width: 180,
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
      title: '审核状态',
      dataIndex: 'verifyStatus',
      key: 'verifyStatus',
      width: 150,
      render: (text, record, index) => {
        let findOne = vertifyStatusList.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '当前信审员',
      dataIndex: 'operatorName',
      key: 'operatorName',
      width: 180,
    },
    {
      title: '授信日期',
      dataIndex: 'orderTime',
      key: 'orderTime',
      width: 180,
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'CZ',
      key: 'CZ',
      width: 180,
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <div>
            <Button type="link" onClick={() => checkDetail(record)}>
              详情
            </Button>
          </div>
        )
      },
    },
  ]

  const checkDetail = (record) => {
    let url = `/credit/examine/detail?creditId=${record.creditId}&orderId=${record.orderId}`
    Router.push(url)
  }

  const pagination = {
    defaultCurrent: 1,
    total: totalData.total,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNo, pageSize) => {
      pageParams.pageNo = pageNo
      pageParams.pageSize = pageSize
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
