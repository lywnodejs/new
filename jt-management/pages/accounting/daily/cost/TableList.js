import React, {useEffect, useState} from 'react'
import {Table} from 'antd'

const TableList = ({list, onPage, pageParams, totalData, productList}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '日期',
      dataIndex: 'statDate',
      key: 'statDate',
      width: 150,
    },
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
      render: (value) => {
        return value || '-'
      },
    },
    {
      title: '总成本',
      dataIndex: 'total',
      key: 'total',
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
      title: '资金',
      dataIndex: 'money',
      key: 'money',
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
      title: '资产',
      dataIndex: 'asset',
      key: 'asset',
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
      title: '短信',
      dataIndex: 'message',
      key: 'message',
      width: 150,
    },
    {
      title: '数据源',
      dataIndex: 'dataSource',
      key: 'dataSource',
      width: 150,
    },
    {
      title: '电子签章',
      dataIndex: 'sign',
      key: 'sign',
      width: 150,
    },
    {
      title: '支付',
      dataIndex: 'pay',
      key: 'pay',
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
      title: '银行卡鉴权',
      dataIndex: 'cardVerify',
      key: 'cardVerify',
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
      title: '智能识别',
      dataIndex: 'faceRcg',
      key: 'faceRcg',
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
      title: '营销成本',
      dataIndex: 'marketing',
      key: 'marketing',
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
    current: pageParams.pageNum,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: (pageNumber) => {
      pageParams.pageNum = pageNumber
      onPage()
    },
  }

  return (
    <Table
      style={{marginTop: 20}}
      rowKey={(record) => record.statDate + Math.random()}
      columns={columns}
      dataSource={list}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
