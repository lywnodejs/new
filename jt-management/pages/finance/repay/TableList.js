import React, {useEffect, useState} from 'react'
import {Table, Badge} from 'antd'

const TableList = ({list, onPage, pageParams}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '序号',
      dataIndex: 'seqNum',
      key: 'seqNum',
      width: 150,
      render: (text, record, index) => {
        return index + 1 + (pageParams.pageNo - 1) * 10
      },
    },
    {
      title: '渠道',
      dataIndex: 'sourcePltfm',
      key: 'sourcePltfm',
      width: 150,
    },
    {
      title: '流水号',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 150,
    },
    {
      title: '身份证号',
      dataIndex: 'idcardNo',
      key: 'idcardNo',
      width: 150,
    },
    {
      title: '借款人手机号',
      dataIndex: 'mobileNo',
      key: 'mobileNo',
      width: 150,
    },
    {
      title: '借款人姓名',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '银行卡卡号',
      dataIndex: 'bankCardNo',
      key: 'bankCardNo',
      width: 150,
    },
    {
      title: '开户银行',
      dataIndex: 'coopBankName',
      key: 'coopBankName',
      width: 150,
    },
    {
      title: '账务日期',
      dataIndex: 'settTime',
      key: 'settTime',
      width: 150,
    },
    {
      title: '资金流向',
      dataIndex: 'deveBusi',
      key: 'deveBusi',
      width: 150,
    },
    {
      title: '业务金额',
      dataIndex: 'busiAmt',
      key: 'busiAmt',
      width: 150,
    },
    {
      title: '核算金额',
      dataIndex: 'settAmt',
      key: 'settAmt',
      width: 150,
    },
    {
      title: '平衡标志',
      dataIndex: 'blncCheckFlag',
      key: 'blncCheckFlag',
      width: 150,
      render: (text, record, index) => {
        return (
          <>
            <Badge status={text ? 'success' : 'error'} />
            {text ? 'Y' : 'N'}
          </>
        )
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
    total: list.total,
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
      rowKey="id"
      dataSource={list.list}
      columns={columns}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
