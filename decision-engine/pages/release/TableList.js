import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table, Button, message} from 'antd'
import api from '~/api/risk'

const BaseVariableTableList = ({
  list,
  onPage,
  pageParams,
  appendToOrderIds,
  verifyStatus,
  activeKey,
  activeModuleKey,
  onVertify,
  onRecord,
  orderBys,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const rowSelection = {
    selectedRowKeys,
    // fixed: 'left',
    onChange: (v) => {
      setSelectedRowKeys(v)
      appendToOrderIds(v)
    },
  }
  const columns = [
    {
      title: '审核单号',
      dataIndex: 'code',
      key: 'code',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'actionType',
      key: 'actionType',
      width: 150,
    },
    {
      title: '编号',
      dataIndex: 'actionCodes',
      key: 'actionCodes',
      width: 250,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 150,
      sorter: true,
    },
    {
      title: '提交人',
      dataIndex: 'submitUser',
      key: 'submitUser',
      width: 150,
    },
    {
      title: '反馈详情',
      dataIndex: 'submitDesc',
      key: 'submitDesc',
      width: 150,
    },
    {
      title: '对照',
      dataIndex: 'haveDiffDetail',
      key: 'haveDiffDetail',
      width: 150,
      render: (text, record, index) => {
        return text ? (
          <Button type="link" onClick={() => onCheckDetail(record)}>
            详情
          </Button>
        ) : (
          '无'
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'stage',
      key: 'stage',
      width: 150,
      render: (text, record, index) => {
        let findOne = verifyStatus.find((item) => item.code == text)
        return findOne ? findOne.name : ''
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 230,
      fixed: 'right',
      // sticky: true,
      render: (text, record, index) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => onBack(record)}
              disabled={!record.enableReturn}
            >
              退回
            </Button>

            <Button
              type="link"
              onClick={() => onVertify(record)}
              disabled={!record.enableAudit}
            >
              审核
            </Button>
            <Button
              type="link"
              onClick={() => onRecord(record)}
              disabled={!record.haveAuditRecord}
            >
              记录
            </Button>
          </>
        )
      },
    },
  ]

  const onBack = async (record) => {
    try {
      const {data} = await api.save_risk_approve_back({
        moduleType: activeModuleKey,
        productId: activeKey,
        id: record.id,
      })
      if (data.code == 0) {
        message.success(`提交成功`)
        onPage()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }
  const onCheckDetail = (record) => {
    let url = `/release/detail?id=${record.id}`
    Router.push(url)
  }
  const onShowSizeChange = (current, pageSize) => {
    pageParams.pageSize = pageSize
    setPageSize(pageSize)
  }
  const pagination = {
    defaultCurrent: 1,
    total: list.totalSize,
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

  const handleTableChange = (pagination, filters, sorter) => {
    orderBys.s = sorter.order === 'ascend' ? 'ASC' : 'DESC'
    onPage()
  }

  return (
    <Table
      rowKey="id"
      dataSource={list.list}
      columns={columns}
      bordered
      pagination={pagination}
      rowSelection={rowSelection}
      scroll={{y: '100%', x: '1600px'}}
      rowClassName={(record, idx) => {
        if (idx % 2 === 0) return 'bg-row'
      }}
      onChange={handleTableChange}
    />
  )
}

export default BaseVariableTableList
