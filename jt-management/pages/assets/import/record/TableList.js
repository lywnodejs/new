import React, {useEffect, useRef, useState} from 'react'
import {Card, Table, message} from 'antd'

const TableList = ({list, onPage, totalData, pageParams, importData}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '导入时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '导入类型',
      dataIndex: 'fileType',
      key: 'fileType',
      width: 150,
      render: (text) => {
        switch (text) {
          case 2:
            return '资产转让'
          case 3:
            return '资产核销'
          case 4:
            return '司法诉讼'
        }
      },
    },
    {
      title: '借款人数量',
      dataIndex: 'loanPersonNum',
      key: 'loanPersonNum',
      width: 150,
    },
    {
      title: '借据数量',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 150,
    },
    {
      title: '借据金额(元)',
      dataIndex: 'iouAmount',
      key: 'iouAmount',
      width: 150,
    },
    {
      title: '处置金额(元)',
      dataIndex: 'dealAmount',
      key: 'dealAmount',
      width: 150,
    },
    {
      title: '操作人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (record, row) => {
        return (
          <a
            onClick={() => {
              importData(row)
            }}
          >
            下载名单
          </a>
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
    total: totalData,
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
    <div>
      <Table
        rowKey="id"
        dataSource={list}
        columns={columns}
        bordered
        scroll={{y: '100%', x: '100%'}}
        style={{marginTop: 20}}
        pagination={pagination}
      />
    </div>
  )
}

export default TableList
