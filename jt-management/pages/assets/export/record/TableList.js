import React, {useEffect, useRef, useState} from 'react'
import {Card, Table, message} from 'antd'

const TableList = ({list, onPage, totalData, pageParams, downloadList}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const emptyDiv = () => {
    return (
      <div style={{height: 300}}>
        <div style={{marginTop: 100}}>
          <p>暂无导出记录</p>
          <p>请先至【资产列表】中导出，再来此页下载</p>
        </div>
      </div>
    )
  }
  const columns = [
    {
      title: '导出时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '文件类型',
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
      title: '剩余金额(元)',
      dataIndex: 'surplusAmount',
      key: 'surplusAmount',
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
      dataIndex: 'createStatus',
      key: 'createStatus',
      width: 150,
      render: (record, row) => {
        if (row.createStatus == 0) {
          return <span>生成中...</span>
        } else if (row.createStatus == 2) {
          return <span>生成失败</span>
        } else if (row.createStatus == 1) {
          return <a onClick={() => downloadList(row)}>下载</a>
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
        locale={{emptyText: emptyDiv()}}
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
