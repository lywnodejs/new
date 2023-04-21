import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table, Button, Popconfirm, message, Badge, Tooltip} from 'antd'
import api from '~/api/marketing'
const TableList = ({list, onPage, onEdit, pullData, pageParams, onVertify}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const columns = [
    {
      title: '券ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '金额(元)',
      dataIndex: 'marketingAmt',
      key: 'marketingAmt',
      width: 100,
    },
    {
      title: '使用期限(天)',
      dataIndex: 'validDate',
      key: 'validDate',
      width: 100,
    },
    {
      title: '描述',
      dataIndex: 'source',
      key: 'source',
      width: 150,
      render: (text, record, index) => {
        return (
          <>
            <Tooltip title={text}>{text}</Tooltip>
          </>
        )
      },
    },
    {
      title: '发放数',
      dataIndex: 'marketingSendNum',
      key: 'marketingSendNum',
      width: 100,
    },
    {
      title: '使用数',
      dataIndex: 'marketingUsedNum',
      key: 'marketingUsedNum',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (text, record, index) => {
        return (
          <>
            <Badge
              status={
                text == 1 ? 'success' : text == 2 ? 'error' : 'processing'
              }
            />
            {text == 1 ? '启用' : text == 2 ? '停用' : '待审核'}
          </>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      render: (text, record, index) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => onEdit(record)}
              disabled={record.status == 1 || record.status == 0}
            >
              编辑
            </Button>

            {(record.status == 1 || record.status == 2) && (
              <Popconfirm
                title={
                  record.status == 1 ? stopReactElement() : startReactElement()
                }
                onConfirm={() => onSwitchStatus(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link">
                  {record.status == 1 ? '停用' : '启用'}
                </Button>
              </Popconfirm>
            )}

            {record.status == 0 && (
              <Button type="link" onClick={() => onVertify(record)}>
                审核
              </Button>
            )}
          </>
        )
      },
    },
  ]

  const onSwitchStatus = async (item) => {
    try {
      const {data} = await api.edit_marketing_ticket({
        status: 0,
        auditStatus: item.status == 1 ? 2 : 1,
        id: item.id,
      })
      if (data.code == 0) {
        message.success(`提交成功`)
        pullData()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const stopReactElement = () => {
    return (
      <>
        <p>停用该优惠券？</p>
        <p>确定后您的操作将会被审核。</p>
      </>
    )
  }
  const startReactElement = () => {
    return (
      <>
        <p>启用该优惠券？启用后将不可编辑。</p>
        <p>确定后您的操作将会被审核。</p>
      </>
    )
  }
  const onShowSizeChange = (current, pageSize) => {
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
