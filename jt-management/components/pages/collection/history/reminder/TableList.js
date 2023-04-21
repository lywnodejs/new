import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableList = ({
  data,
  collectionProducts,
  urgeMethods,
  pageParams,
  changeList,
  selectedRowKeys,
  setSelectedRowKeys,
  urgeObjects = [],
  urgeRepayDesires = [],
  urgeResultUnknows = [],
  urgeResultHighs = [],
  urgeReasonTypes = [],
  urgeResultLows = [],
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
      title: '联系号码',
      dataIndex: 'collectionMobilePhone',
      key: 'collectionMobilePhone',
      width: 150,
    },
    {
      title: '催收方式',
      dataIndex: 'collectionMethod',
      key: 'collectionMethod',
      width: 150,
      render: (text, record, index) => {
        let findOne = urgeMethods.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '催收对象',
      dataIndex: 'collectionObject',
      key: 'collectionObject',
      width: 150,
      render: (text, record, index) => {
        let findOne = urgeObjects.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '还款意愿',
      dataIndex: 'repayDesire',
      key: 'repayDesire',
      width: 150,
      render: (text, record, index) => {
        let findOne = urgeRepayDesires.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '联络结果',
      dataIndex: 'collectionResult',
      key: 'collectionResult',
      width: 150,
      render: (text, record, index) => {
        if (record.repayDesire == 1) {
          let findOne = urgeResultUnknows.find((one) => one.code == text)
          return findOne ? findOne.description : ''
        }
        if (record.repayDesire == 2) {
          let findOne = urgeResultHighs.find((one) => one.code == text)
          return findOne ? findOne.description : ''
        }
        if (record.repayDesire == 3) {
          let findOne = urgeResultLows.find((one) => one.code == text)
          return findOne ? findOne.description : ''
        }
      },
    },
    {
      title: '承若换还款日期',
      dataIndex: 'promiseRepayTime',
      key: 'promiseRepayTime',
      width: 150,
    },
    {
      title: '逾期金额',
      dataIndex: 'overdueAmount',
      key: 'overdueAmount',
      width: 150,
    },
    {
      title: '逾期原因',
      dataIndex: 'reasonType',
      key: 'reasonType',
      width: 150,
      render: (text, record, index) => {
        let findOne = urgeReasonTypes.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
      width: 150,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
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
