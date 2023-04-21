import React, {useEffect, useState, useContext} from 'react'
import {Table, Button, Card} from 'antd'
import Router from 'next/router'

const TableList = ({list, onPage, pageParams, totalData, totalNum}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'userName',
      key: 'userName',
      width: 100,
    },
    {
      title: 'Ⅱ类户账号',
      dataIndex: 'accountNo',
      key: 'accountNo',
      width: 150,
    },
    {
      title: '账户余额',
      dataIndex: 'endAmt',
      key: 'endAmt',
      width: 100,
    },
    {
      title: '证件号码',
      dataIndex: 'idCard',
      key: 'idCard',
      width: 150,
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      key: 'userPhone',
      width: 150,
    },
    {
      title: '绑定账户',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 250,
      render: (value, row) => {
        return `${value} ${row.bankCard}`
      },
    },
    {
      title: '开户时间',
      dataIndex: 'createTimeStr',
      key: 'createTimeStr',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (text, record, row) => {
        return (
          <Button type="link" onClick={() => checkDetail(record)}>
            查看流水
          </Button>
        )
      },
    },
  ]

  const checkDetail = (record) => {
    let url = `/accounting/second/detail?accountNo=${record.accountNo}`
    Router.push(url)
  }

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
      <span>Ⅱ类户交易金额总计：{totalNum}</span>
      <Table
        style={{marginTop: 20}}
        rowKey={(record) => record.userPhone + Math.random()}
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
