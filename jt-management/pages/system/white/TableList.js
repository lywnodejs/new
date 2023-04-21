import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table, Button, Popconfirm, message, Badge, Tooltip} from 'antd'
import api from '~/api/system'
const TableList = ({
  list,
  onPage,
  onEdit,
  pullData,
  pageParams,
  onVertify,
  labels,
}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const columns = [
    {
      title: '公司名称',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 100,
    },
    {
      title: '标签',
      dataIndex: 'label',
      key: 'label',
      width: 100,
      render: (text, record, index) => {
        let findOne = labels.find((item) => item.code == text)
        return findOne ? findOne.description : ''
      },
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'useStatus',
      key: 'useStatus',
      width: 100,
      render: (text, record, index) => {
        return (
          <>
            <Badge
              status={
                text == 1 ? 'success' : text == 2 ? 'processing' : 'error'
              }
            />
            {text == 1 ? '启用' : text == 2 ? '待审核' : '停用'}
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
            <Button type="link" onClick={() => onEdit(record)}>
              编辑
            </Button>

            {(record.useStatus == 1 || record.useStatus == 0) && (
              <Popconfirm
                title={
                  record.useStatus == 1
                    ? stopReactElement()
                    : startReactElement()
                }
                onConfirm={() => onSwitchStatus(record)}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link">
                  {record.useStatus == 1 ? '停用' : '启用'}
                </Button>
              </Popconfirm>
            )}

            {record.useStatus == 2 && (
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
      const {data} = await api.edit_ipconfig_one({
        useStatus: 2,
        auditStatus: item.useStatus == 1 ? 0 : 1,
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
        <p>停用该配置么？</p>
      </>
    )
  }
  const startReactElement = () => {
    return (
      <>
        <p>启用该配置么？</p>
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
