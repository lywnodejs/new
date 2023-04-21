import React, {useEffect, useState, useContext} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableList = ({
  data,
  collectionProducts,
  pageParams,
  changeList,
  selectedRowKeys,
  setSelectedRowKeys,
  onEditMemo,
}) => {
  const rowSelection = {
    selectedRowKeys,
    fixed: 'left',
    onChange: (v) => {
      setSelectedRowKeys(v)
    },
  }

  const checkRecord = (record) => {
    let url = `/collection/reminded/form?tag=collectionRecord&id=${record.id}`
    Router.push(url)
  }
  const checkOrder = (record) => {
    let url = `/collection/reminded/form?id=${record.id}`
    Router.push(url)
  }

  const checkDetail = (record) => {
    // let url = `/collection/reminded/detail?id=${record.loanApplyId}`
    let url = `/accounting/iou/detail?orderNum=${record.xdyOrderNum}`
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
      title: '放款日期',
      dataIndex: 'grantTime',
      key: 'grantTime',
      width: 150,
      sorter: true,
    },
    {
      title: '已逾期总本金',
      dataIndex: 'planCapitalAmount',
      key: 'planCapitalAmount',
      width: 150,
      sorter: true,
    },
    {
      title: '应还本息',
      dataIndex: 'planCapitalPenaltyAmount',
      key: 'planCapitalPenaltyAmount',
      width: 150,
      sorter: true,
    },
    {
      title: '罚息',
      dataIndex: 'planPenaltyAmount',
      key: 'planPenaltyAmount',
      width: 150,
    },
    {
      title: '应还总额',
      dataIndex: 'planTotalAmount',
      key: 'planTotalAmount',
      width: 150,
      sorter: true,
    },
    {
      title: '挂账金额',
      dataIndex: 'realOfflineRepayAmount',
      key: 'realOfflineRepayAmount',
      width: 150,
      sorter: true,
    },
    {
      title: '联系日期',
      dataIndex: 'lastCollectionTime',
      key: 'lastCollectionTime',
      width: 150,
      sorter: true,
    },
    {
      title: '承若还款日期',
      dataIndex: 'promiseRepayTime',
      key: 'promiseRepayTime',
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
      title: '催收员',
      dataIndex: 'accountName',
      key: 'accountName',
      width: 150,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 150,
    },
    {
      title: '催记信息',
      dataIndex: 'collectionTimes',
      key: 'collectionTimes',
      width: 150,
      // render: (text, record, index) => {
      //   return text ? (
      //     <Button type="link" onClick={() => checkRecord(record)}>
      //       {text}
      //     </Button>
      //   ) : null
      // },
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
              借款详情
            </Button>
            <Button type="link" onClick={() => checkOrder(record)}>
              查看订单
            </Button>
            <Button type="link" onClick={() => onEditMemo(record)}>
              备注
            </Button>
          </>
        )
      },
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
