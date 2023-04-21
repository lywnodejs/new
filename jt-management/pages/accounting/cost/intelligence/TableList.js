import React, {useEffect, useState} from 'react'
import {Table} from 'antd'

const TableList = ({
  list,
  totalData,
  onPage,
  pageParams,
  newIntellligenceList,
}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const columns = [
    {
      title: '日期',
      dataIndex: 'statDate',
      key: 'statDate',
      width: 150,
    },
    {
      title: '机构',
      dataIndex: 'channelId',
      key: 'channelId',
      width: 150,
      render: (text, record, index) => {
        let findOne = newIntellligenceList.find((one) => one.id == text)
        return findOne ? findOne.name : '-'
      },
    },
    {
      title: '产品',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
    },
    {
      title: '总成本',
      dataIndex: 'totalCost',
      key: 'totalCost',
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
      title: 'OCR调用量',
      dataIndex: 'ocrNum',
      key: 'ocrNum',
      width: 150,
    },
    {
      title: 'OCR成本（元）',
      dataIndex: 'ocrCost',
      key: 'ocrCost',
      width: 150,
    },
    {
      title: '人脸核身调用量',
      dataIndex: 'faceCheckNum',
      key: 'faceCheckNum',
      width: 150,
    },
    {
      title: '人脸核身成本',
      dataIndex: 'faceCheckCost',
      key: 'faceCheckCost',
      width: 150,
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
      rowKey={(record) => record.ocrCost + Math.random()}
      columns={columns}
      dataSource={list}
      bordered
      pagination={pagination}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
