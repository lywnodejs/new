import React, {useEffect, useState} from 'react'
import {Table, Button, Card} from 'antd'
import Router from 'next/router'

const TableList = ({
  list,
  onPage,
  pageParams,
  totalData,
  totalNum,
  productList,
  accountList,
}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '发生时间',
      dataIndex: 'grantTimeStr',
      key: 'grantTimeStr',
      width: 150,
    },
    {
      title: '会计日期',
      dataIndex: 'accountDay',
      key: 'accountDay',
      width: 150,
    },

    {
      title: '借据号',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 150,
    },
    {
      title: '流水号',
      dataIndex: 'bankOrderNum',
      key: 'bankOrderNum',
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
      title: '发生金额（元）',
      dataIndex: 'withdrawAmount',
      key: 'withdrawAmount',
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
      title: '利率',
      dataIndex: 'policyLoanRate',
      key: 'policyLoanRate',
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
      title: '借款人账户',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 150,
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
      title: '行方账户',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
      width: 150,
      render: (text, record, index) => {
        let findOne = accountList.find((one) => one.code == text)
        return findOne ? findOne.description : '-'
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
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNo = pageNumber
      onPage()
    },
  }
  return (
    <Card>
      <span>放款总计：{totalNum}</span>
      <Table
        style={{marginTop: 20}}
        rowKey={(record) => record.bankOrderNum + Math.random()}
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
