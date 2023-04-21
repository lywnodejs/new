import React, {useEffect, useState, useContext} from 'react'
import {Table, Button} from 'antd'
import Router from 'next/router'

const TableList = ({
  list,
  onPage,
  pageParams,
  statusList,
  productList,
  totalData,
}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

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
      title: '借据号',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 150,
    },
    {
      title: '借款人',
      dataIndex: 'realName',
      key: 'realName',
      width: 150,
    },

    {
      title: '借款人手机号',
      dataIndex: 'mobilePhone',
      key: 'mobilePhone',
      width: 150,
    },
    {
      title: '借款周期',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (record, row) => {
        return (
          <div>
            {row.grantFinishTime != '' ? (
              <p>借：{timeConversion(row.grantFinishTime)}</p>
            ) : null}
            {row.finalRepayDate != '' ? (
              <p>还：{timeConversion(row.finalRepayDate)}</p>
            ) : null}
          </div>
        )
      },
    },
    {
      title: '产品',
      dataIndex: 'productId',
      key: 'productId',
      width: 150,
      render: (text, record, index) => {
        let findOne = productList.find((one) => one.id == text)
        return findOne ? findOne.name : ''
      },
    },
    {
      title: '年利率（%）',
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
      title: '借款金额（元）',
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
      title: '剩余应还（元）',
      dataIndex: 'surplusPayableAmount',
      key: 'surplusPayableAmount',
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
      title: '借据状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (text, record, index) => {
        let findOne = statusList.find((one) => one.code == text)
        return findOne ? findOne.description : ''
      },
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
              详情
            </Button>
          </>
        )
      },
    },
  ]

  const checkDetail = (record) => {
    let url = `/accounting/iou/detail?orderNum=${record.orderNum}`
    Router.push(url)
  }

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize)
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: totalData != null ? totalData.total : list.length,
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
    <Table
      style={{marginTop: 20}}
      rowKey="id"
      columns={columns}
      dataSource={list}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
