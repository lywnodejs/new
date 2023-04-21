import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableList = ({
  list,
  onPage,
  companys,
  pageParams,
  collectionLevels,
  collectionProducts,
}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'productId',
      key: 'productId',
      width: 150,
      render: (text, record, index) => {
        let findOne = collectionProducts.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '入催日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '入催笔数',
      dataIndex: 'totalNum',
      key: 'totalNum',
      width: 150,
    },
    {
      title: '逾期总本金',
      dataIndex: 'totalCapitalAmount',
      key: 'totalCapitalAmount',
      width: 150,
    },
    {
      title: '逾期已还总本金',
      dataIndex: 'realTotalCapitalAmount',
      key: 'realTotalCapitalAmount',
      width: 150,
    },
    {
      title: '入催总额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
    },
    {
      title: '入催已还总额',
      dataIndex: 'realTotalAmount',
      key: 'realTotalAmount',
      width: 150,
    },
    {
      title: '逾期已还总本金比例',
      dataIndex: 'realTotalCapitalRate',
      key: 'realTotalCapitalRate',
      width: 150,
      render: (text, record, index) => {
        return text + '%'
      },
    },
    {
      title: '入催已还总比例',
      dataIndex: 'realTotalRate',
      key: 'realTotalRate',
      width: 150,
      render: (text, record, index) => {
        return text + '%'
      },
    },
  ]

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
      columns={columns}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
