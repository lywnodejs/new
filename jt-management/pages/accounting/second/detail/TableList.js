import React, {useEffect, useState} from 'react'
import {Table, Button, Card} from 'antd'
import Router from 'next/router'
const TableList = ({
  onPage,
  pageParams,
  data: {list = [], total = ''},
  accountList,
}) => {
  const columns = [
    {
      title: '发生时间',
      dataIndex: 'payTimeStr',
      key: 'payTimeStr',
      width: 150,
    },
    {
      title: '交易账号',
      dataIndex: 'accountNo',
      key: 'accountNo',
      width: 150,
      render: (record, row) => {
        return (
          <div>
            <p>{row.userName}</p>
            <p>{row.accountNo}</p>
          </div>
        )
      },
    },

    {
      title: '交易类型',
      dataIndex: 'tradeType',
      key: 'tradeType',
      width: 150,
      render: (text) => {
        switch (text) {
          case 1:
            return '转入'
          case 2:
            return '转出'
          case 3:
            return '还款'
          case 4:
            return ' 放款'
        }
      },
    },
    {
      title: '对手账号',
      dataIndex: 'targetAccountNo',
      key: 'targetAccountNo',
      width: 250,
      render: (record, row) => {
        if (!row.targetAccountNo) return '-'
        return (
          <div>
            <p>{row.userName}</p>
            <p>
              {row.bankName}{' '}
              {row.targetAccountNo.replace(
                /^(.{3})(?:\d+)(.{4})$/,
                '$1*** **** **** $2',
              )}
            </p>
          </div>
        )
      },
    },
    {
      title: '交易金额（元）',
      dataIndex: 'tradeAmt',
      key: 'tradeAmt',
      width: 150,
      render: (record) => {
        if (record == null) {
          return null
        } else {
          let str = Number(record).toLocaleString()
          return str
        }
      },
    },

    {
      title: '交易流水号',
      dataIndex: 'tradeNo',
      key: 'tradeNo',
      width: 150,
    },

    {
      title: '行方账户',
      dataIndex: 'payChannel',
      key: 'payChannel',
      width: 150,
      render: (text, record, index) => {
        let findOne = accountList.find((one) => one.code == text)
        return findOne ? findOne.description : '-'
      },
    },
    {
      title: '三方流水号',
      dataIndex: 'payOrderNo',
      key: 'payOrderNo',
      width: 150,
    },
  ]

  const pagination = {
    defaultCurrent: 1,
    total: total,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: onPage,
  }
  return (
    <Card>
      <Table
        style={{marginTop: 20}}
        rowKey={(record) => record.tradeNo + Math.random()}
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
