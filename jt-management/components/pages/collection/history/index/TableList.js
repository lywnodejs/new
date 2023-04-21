import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

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

  const checkDetail = (record) => {
    let url = `/collection/history/home/detail?id=${record.id}`
    Router.push(url)
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
      title: '状态',
      dataIndex: 'collectionStatus',
      key: 'collectionStatus',
      width: 150,
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
      title: '催收级别',
      dataIndex: 'collectionLevel',
      key: 'collectionLevel',
      width: 150,
    },
    {
      title: '申请日期',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 150,
    },
    {
      title: '逾期总本金',
      dataIndex: 'totalCapitalAmount',
      key: 'totalCapitalAmount',
      width: 150,
    },
    {
      title: '入催期应还日期',
      dataIndex: 'planRepayTime',
      key: 'planRepayTime',
      width: 150,
    },
    {
      title: '入催日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '逾期天数',
      dataIndex: 'overdueDays',
      key: 'overdueDays',
      width: 150,
    },

    {
      title: '催收员',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <Button type="link" onClick={() => checkDetail(record)}>
            历史详情
          </Button>
        )
      },
    },
  ]

  const onChange = (pagination, filters, sorter, extra) => {
    console.log(pagination, filters, sorter, extra)
    pageParams.page = pagination.current
    pageParams.pageSize = pagination.pageSize
    changeList(pageParams)
  }

  const paginationConfig = {
    total: data.total,
    current: pageParams.page,
    showSizeChanger: true,
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
      // rowSelection={rowSelection}
      scroll={{
        y: '100%',
        x: '100%',
      }}
      onChange={onChange}
    />
  )
}

export default TableList
