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
  selectedRowKeys,
  setSelectedRowKeys,
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
      title: '机审出额',
      dataIndex: 'policyLoanAmount',
      key: 'policyLoanAmount',
      width: 180,
    },

    {
      title: '授信日期',
      dataIndex: 'orderTime',
      key: 'orderTime',
      width: 180,
    },
    {
      title: '已过时长/总时长',
      dataIndex: 'waitHours',
      key: 'waitHours',
      width: 180,
      render: (record, row) => {
        return (
          <div>
            <p>
              {row.waitHours}&nbsp;/&nbsp;{row.waitOverallHours}
            </p>
          </div>
        )
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
      title: '当前信审员',
      dataIndex: 'operatorName',
      key: 'operatorName',
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
          <>
            <a onClick={() => checkDetail(record)}>详情</a>
          </>
        )
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

  const rowSelection = {
    selectedRowKeys,
    fixed: 'left',
    onChange: (v) => {
      setSelectedRowKeys(v)
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
        rowSelection={rowSelection}
      />
    </Card>
  )
}

export default TableList
