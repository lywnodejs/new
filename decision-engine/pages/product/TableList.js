import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table, Button} from 'antd'

const TableList = ({list, onEdit, onDelete, copyText}) => {
  const columns = [
    {
      title: '产品ID',
      dataIndex: 'produceId',
      key: 'produceId',
      // width: 232,
      // fixed: 'left',
      render: (text, record) => {
        return <a onClick={() => copyText(record)}>{text}</a>
      },
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      // width: 232,
    },
    {
      title: '还款方式',
      dataIndex: 'repaymentType',
      key: 'repaymentType',
      width: 280,
    },
    {
      title: '贷款期限',
      dataIndex: 'loanDays',
      key: 'loanDays',
      // width: 232,
    },
    {
      title: '额度范围',
      dataIndex: 'limitMin',
      key: 'limitMin',
      // width: 232,
      render: (text, record, index) => {
        return text + '-' + record.limitMax
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      // width: 232,
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 180,
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <>
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>
            <Button type="link" onClick={() => onDelete(record)}>
              删除
            </Button>
          </>
        )
      },
    },
  ]

  return (
    <Table
      rowKey="id"
      title={() => '产品列表'}
      dataSource={list}
      columns={columns}
      bordered
      pagination={false}
      scroll={{y: '100%', x: '1600px'}}
      rowClassName={(record, idx) => {
        if (idx % 2 === 0) return 'bg-row'
      }}
    />
  )
}

export default TableList
