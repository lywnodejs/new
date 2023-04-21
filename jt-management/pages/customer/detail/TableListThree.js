import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableListThree = ({customerLetterList, productList, keyId}) => {
  const columns = [
    {
      title: '借款日期',
      dataIndex: 'loanDate',
      key: 'loanDate',
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
      title: '借款总额（元）',
      dataIndex: 'signLoanAmount',
      key: 'signLoanAmount',
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
      title: '已还期数',
      dataIndex: 'repaymentTerms',
      key: 'repaymentTerms',
      width: 150,
    },
    {
      title: '待还本息（元）',
      dataIndex: 'feeAmount',
      key: 'feeAmount',
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
      title: '逾期本息（元）',
      dataIndex: 'penaltyAmount',
      key: 'penaltyAmount',
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
      title: '状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 200,
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
              查看详情
            </Button>
          </>
        )
      },
    },
  ]

  const checkDetail = (record) => {
    location.href = `/accounting/iou/detail?orderNum=${record.orderNum}`
  }

  return (
    <Table
      rowKey="id"
      dataSource={customerLetterList}
      columns={columns}
      bordered
      scroll={{y: '100%', x: '100%'}}
      style={{marginTop: 20}}
    />
  )
}

export default TableListThree
