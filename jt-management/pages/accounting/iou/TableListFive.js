import React, {useEffect, useState} from 'react'
import {Table, Button} from 'antd'

const TableListFive = ({loanDeductRecordDtos}) => {
  const columns = [
    {
      title: '流水号',
      dataIndex: 'no',
      key: 'no',
      width: 150,
    },
    {
      title: '还款金额',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      width: 150,
    },
    {
      title: '还款状态',
      dataIndex: 'statusDesc',
      key: 'statusDesc',
      width: 150,
    },
    {
      title: '还款方式',
      dataIndex: 'repayTypeDesc',
      key: 'repayTypeDesc',
      width: 150,
    },
    {
      title: '账户类型',
      dataIndex: 'accountTypeStr',
      key: 'accountTypeStr',
      width: 150,
    },

    {
      title: '银行名称',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 150,
    },
    {
      title: '卡号',
      dataIndex: 'cardNo',
      key: 'cardNo',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },

    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 150,
    },
  ]

  return (
    <Table
      rowKey="id"
      dataSource={loanDeductRecordDtos}
      columns={columns}
      bordered
      scroll={{y: '100%', x: '100%'}}
      style={{marginTop: 20}}
    />
  )
}

export default TableListFive
