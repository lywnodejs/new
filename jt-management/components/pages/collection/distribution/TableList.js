import React, {useEffect, useState} from 'react'
import {Table} from 'antd'

const TableList = ({
  data,
  collectionProducts,
  pageParams,
  changeList,
  selectedRowKeys,
  setSelectedRowKeys,
}) => {
  const rowSelection = {
    selectedRowKeys,
    fixed: 'left',
    onChange: (v) => {
      setSelectedRowKeys(v)
    },
  }

  const columns = [
    {
      title: '借据号',
      dataIndex: 'xdyOrderNum',
      key: 'xdyOrderNum',
      width: 150,
      fixed: 'left',
    },
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
      title: '期数',
      dataIndex: 'loanApplyTerms',
      key: 'loanApplyTerms',
      width: 150,
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '手机号',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      width: 150,
    },
    {
      title: '申请日期',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 150,
      sorter: true,
    },
    {
      title: '已逾期总本金',
      dataIndex: 'totalCapitalAmount',
      key: 'totalCapitalAmount',
      width: 150,
      sorter: true,
    },
    {
      title: '剩余应还金额',
      dataIndex: 'restOverdueAmount',
      key: 'restOverdueAmount',
      width: 150,
      sorter: true,
    },
    {
      title: '应还日期',
      dataIndex: 'planRepayTime',
      key: 'planRepayTime',
      width: 150,
      sorter: true,
    },
    {
      title: '逾期天数',
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      width: 150,
      sorter: true,
    },
    {
      title: '催收级别',
      dataIndex: 'collectionLevel',
      key: 'collectionLevel',
      width: 150,
      sorter: true,
    },
    {
      title: '入催日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
      sorter: true,
    },
  ]

  const onChange = (pagination, filters, sorter, extra) => {
    let orderBys = sorter.field
      ? {
          f: sorter.field,
          s: sorter.order === 'ascend' ? 'asc' : 'desc',
        }
      : null

    pageParams.page = extra.action === 'sort' ? 1 : pagination.current
    pageParams.pageSize = pagination.pageSize
    changeList(pageParams, orderBys)
  }

  const paginationConfig = {
    total: data.total,
    current: pageParams.page,
    showSizeChanger: false,
    showQuickJumper: true,
    defaultPageSize: pageParams.pageSize,
    showTotal: (total) => `共 ${total} 条`,
  }

  return (
    <Table
      rowKey="id"
      dataSource={data.list}
      columns={columns}
      bordered
      pagination={paginationConfig}
      rowSelection={rowSelection}
      scroll={{
        y: '100%',
        x: '100%',
      }}
      onChange={onChange}
    />
  )
}

export default TableList
