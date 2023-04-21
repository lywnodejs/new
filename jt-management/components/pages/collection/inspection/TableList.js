import React, {useEffect, useState, useContext} from 'react'
import {Button, Table} from 'antd'
import Router from 'next/router'
import {QUALIFI_TYPE} from '~/utils/const'

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
    let url = `/collection/after/detail?id=${record.id}&type=1`
    Router.push(url)
  }

  const columns = [
    {title: '借据号', dataIndex: 'orderNum', width: 150, fixed: 'left'},
    {title: '检查编号', dataIndex: 'reviewOrderNum', width: 150},
    {
      title: '产品名称',
      dataIndex: 'productId',
      width: 150,
      render: (text, record, index) => {
        let findOne = collectionProducts.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {title: '用户名', dataIndex: 'realName', width: 150},
    {title: '手机号', dataIndex: 'mobilePhone', width: 150},
    {title: '借款金额', dataIndex: 'loanAmount', width: 150},
    {title: '借款期数', dataIndex: 'loanApplyTerm', width: 150},
    {title: '还款方式', dataIndex: 'repayTypeString', width: 150},
    {title: '检查日期', dataIndex: 'creviewCreateTime', width: 150},
    {title: '检查原因', dataIndex: 'reviewReason', width: 150},
    {title: '检查员', dataIndex: 'reviewName', width: 150},
    {title: '已过时长/总时长', dataIndex: 'timeString', width: 150},
    {
      title: '综合资质',
      dataIndex: 'creviewQualification',
      width: 150,
      render: (t) => {
        let item = QUALIFI_TYPE.find((v) => v.key == t)
        return (item && item.name) || ''
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      width: 150,
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <Button type="link" onClick={() => checkDetail(record)}>
            查看详情
          </Button>
        )
      },
    },
  ]

  const onChange = (pagination, filters, sorter, extra) => {
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
