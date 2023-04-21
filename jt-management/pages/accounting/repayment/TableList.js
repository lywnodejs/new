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
      dataIndex: 'accountTimeStr',
      key: 'accountTimeStr',
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
      title: '借款人',
      dataIndex: 'realName',
      key: 'realName',
      width: 150,
      render: (record, row) => {
        return (
          <span>
            {row.realName}&nbsp;&nbsp;{row.mobilePhone}
          </span>
        )
      },
    },
    {
      title: '利率',
      dataIndex: 'rate',
      key: 'rate',
      width: 150,
    },
    {
      title: '发生金额（元）',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
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
      title: '实际金额（元）',
      dataIndex: 'realAmount',
      key: 'realAmount',
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
      title: '抵用金额（元）',
      dataIndex: 'couponAmount',
      key: 'couponAmount',
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
      title: '还款本金',
      dataIndex: 'capitalAmount',
      key: 'capitalAmount',
      width: 150,
    },
    {
      title: '还款利息',
      dataIndex: 'interestAmount',
      key: 'interestAmount',
      width: 150,
    },
    {
      title: '还款罚息',
      dataIndex: 'penaltyAmount',
      key: 'penaltyAmount',
      width: 150,
    },
    {
      title: '还款账户',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 150,
      render: (record, row) => {
        return (
          <div>
            <p>
              {row.bankName}&nbsp;&nbsp;{row.cardNo}
            </p>
          </div>
        )
      },
    },
    // {
    //   title: '借款人账户',
    //   dataIndex: 'bankName',
    //   key: 'bankName',
    //   width: 150,
    // render: (record, row) => {
    //   return (
    //     <div>
    //       <p>
    //         {row.realName}&nbsp;&nbsp;{row.bankName}
    //       </p>
    //       <p>{row.cardNo}</p>
    //     </div>
    //   )
    // },
    // },
    {
      title: '行方账户',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
      width: 150,
      render: (text, record, index) => {
        let findOne = accountList.find((one) => one.code == text)
        return findOne ? findOne.description : <span>{text}</span>
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
      <span>还款总计：{totalNum} 元</span>
      <Table
        style={{marginTop: 20}}
        rowKey={(record) => record.orderAmount + Math.random()}
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
