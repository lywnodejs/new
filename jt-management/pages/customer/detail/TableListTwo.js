import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableListOne = ({customerAmountChangeRecord, productList}) => {
  const timeConversion = (times) => {
    let date = new Date(times)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    return y + '-' + m + '-' + d
  }
  const columns = [
    {
      title: '调整时间',
      dataIndex: 'createTime',
      key: 'createTime',
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
      title: '授信额度（元）',
      dataIndex: 'fixedLimitAmount',
      key: 'fixedLimitAmount',
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
      title: '年化利率',
      dataIndex: 'fixedLimitRate',
      key: 'fixedLimitRate',
      width: 150,
      render: (record, text) => {
        if (record == 0) {
          return 0
        }
        let str = Number(record * 100).toFixed(3)
        str += '%'
        return str
      },
    },
    {
      title: '额度状态',
      dataIndex: 'accountStatus',
      key: 'accountStatus',
      width: 150,
    },
    {
      title: '额度有效期',
      dataIndex: 'fixedEndDate',
      key: 'fixedEndDate',
      width: 200,
      render: (text) => {
        return timeConversion(text)
      },
    },
    {
      title: '操作人',
      dataIndex: 'updateUser',
      key: 'updateUser',
      width: 200,
    },
  ]

  return (
    <Table
      rowKey="id"
      dataSource={customerAmountChangeRecord}
      columns={columns}
      bordered
      scroll={{y: '100%', x: '100%'}}
      style={{marginTop: 20}}
    />
  )
}

export default TableListOne
