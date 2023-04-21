import React, {useEffect, useState} from 'react'
import {Table, Button, Card} from 'antd'
import Router from 'next/router'

const TableList = ({}) => {
  //   const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '借据号',
      dataIndex: 'grantTimeStr',
      key: 'grantTimeStr',
      width: 180,
      fixed: 'left',
    },
    {
      title: '手机号',
      dataIndex: 'accountDay',
      key: 'accountDay',
      width: 180,
    },
    {
      title: '债务人名称',
      dataIndex: 'productId',
      key: 'productId',
      width: 180,
      render: (text, record, index) => {
        let findOne = productList.find((one) => one.id == text)
        return findOne ? findOne.name : ''
      },
    },
    {
      title: '债务人身份标识号码',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 180,
    },
    {
      title: '担保方式',
      dataIndex: 'bankOrderNum',
      key: 'bankOrderNum',
      width: 180,
    },

    {
      title: '抵质押物种类',
      dataIndex: 'withdrawAmount',
      key: 'withdrawAmount',
      width: 180,
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
      title: '抵押物唯一标识号',
      dataIndex: 'policyLoanRate',
      key: 'policyLoanRate',
      width: 180,
      render: (record, text) => {
        if (record == 0) {
          return 0
        }
        let str = Number(record * 100).toFixed(2)
        str += '%'
        return str
      },
    },
    {
      title: '抵质押物价值（元)',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 180,
      render: (record, row) => {
        return (
          <div>
            <p>
              {row.realName}&nbsp;&nbsp;{row.bankName}
            </p>
            <p>{row.cardNo}</p>
          </div>
        )
      },
    },
    {
      title: '担保金额（元）',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
      width: 180,
      render: (text, record, index) => {
        let findOne = accountList.find((one) => one.code == text)
        return findOne ? findOne.description : '-'
      },
    },
    {
      title: '登记状态',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
      width: 180,
      render: (text, record, index) => {
        let findOne = accountList.find((one) => one.code == text)
        return findOne ? findOne.description : '-'
      },
    },
    {
      title: '到期日期',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 180,
    },
  ]

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  //   const pagination = {
  //     defaultCurrent: 1,
  //     total: totalData.total,
  //     pageSize: pageSize,
  //     showQuickJumper: true,
  //     showSizeChanger: true,
  //     onShowSizeChange: onShowSizeChange,
  //     current: pageParams.pageNo,
  //     showTotal: (total) => {
  //       return `共 ${total} 条记录`
  //     },
  //     onChange: (pageNumber) => {
  //       pageParams.pageNo = pageNumber
  //       onPage()
  //     },
  //   }
  return (
    <Card>
      <Table
        style={{marginTop: 20}}
        rowKey="id"
        columns={columns}
        // dataSource={list}
        bordered
        // pagination={pagination}
        scroll={{y: '100%', x: '100%'}}
      />
    </Card>
  )
}

export default TableList
