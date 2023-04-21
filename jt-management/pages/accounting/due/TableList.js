import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'

const TableList = ({list, onPage, pageParams, totalData, productList}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '借据号',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 150,
    },
    {
      title: '应还日期',
      dataIndex: 'deductDateStr',
      key: 'deductDateStr',
      width: 150,
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
      title: '客户名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '证件号码',
      dataIndex: 'idcard',
      key: 'idcard',
      width: 150,
    },
    {
      title: '还款期数',
      dataIndex: 'currItem',
      key: 'currItem',
      width: 150,
      render: (record, row) => {
        return (
          <span>
            {row.currItem}/{row.totalItem}
          </span>
        )
      },
    },
    {
      title: '应还款总额（元）',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 150,
    },
    {
      title: '剩余应还款（元）',
      dataIndex: 'leftAmount',
      key: 'leftAmount',
      width: 150,
    },
    {
      title: '剩余本金（元）',
      dataIndex: 'leftCap',
      key: 'leftCap',
      width: 150,
    },
    {
      title: '剩余利息（元）',
      dataIndex: 'leftInt',
      key: 'leftInt',
      width: 150,
    },
    {
      title: '剩余罚息（元）',
      dataIndex: 'leftPenalty',
      key: 'leftPenalty',
      width: 150,
    },
    {
      title: '起息日',
      dataIndex: 'interestDateStr',
      key: 'interestDateStr',
      width: 150,
    },
    {
      title: '逾期天数',
      dataIndex: 'overdueDay',
      key: 'overdueDay',
      width: 150,
    },
    {
      title: '客户经理',
      dataIndex: 'custName',
      key: 'custName',
      width: 150,
      render: (record, row) => {
        return (
          <span>
            {row.custName !== null ? (
              <span>
                {row.custName} ({row.custNo})
              </span>
            ) : null}
          </span>
        )
      },
    },
  ]

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
    current: pageParams.pageNum,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNum = pageNumber
      onPage()
    },
  }

  return (
    <Table
      style={{marginTop: 20}}
      rowKey={(record) => record.interestDateStr + Math.random()}
      columns={columns}
      dataSource={list}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
