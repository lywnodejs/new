import React, {useEffect, useState, useContext} from 'react'
import {Table, Button, Select, Space, message} from 'antd'

import {ORDER_STATUS} from '~/utils/const'

const TableList = ({
  list,
  onPage,
  pageParams,
  appendToOrderIds,
  allocat,
  checkDetail,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const rowSelection = {
    selectedRowKeys,
    fixed: 'left',
    onChange: (v) => {
      setSelectedRowKeys(v)
      appendToOrderIds(v)
    },
  }

  const columns = [
    {
      title: '任务类型',
      dataIndex: 'type',
      render: (text) => {
        return text == 0 ? '下户调查' : '贷后检查'
      },
    },
    {title: '任务下发时间', dataIndex: 'createTime'},
    {title: '产品名称', dataIndex: 'loanName'},
    {title: '订单号', dataIndex: 'orderNo'},
    {title: '用户名', dataIndex: 'userName'},
    {title: '手机号', dataIndex: 'mobilePhone'},
    {title: '渠道', dataIndex: 'channel'},
    // {title: '申请日期', dataIndex: 'loanApplyTime'},
    {
      title: '状态',
      dataIndex: 'orderStatus',
      render: (text, record, index) => {
        let item = ORDER_STATUS.find((v) => v.key == text)
        return (item && item.name) || '-'
      },
    },

    // {title: '当前信审员', dataIndex: 'auditUserName'},
    {
      title: '客户经理',
      dataIndex: 'userManagerName',
      render: (record, text, index) => {
        return (
          <span>
            {text.userManagerName != null || text.jobNumber != null ? (
              <span>
                {text.userManagerName} ({text.jobNumber})
              </span>
            ) : null}
          </span>
        )
      },
    },
    {title: '最新分配时间', dataIndex: 'distributionTime'},
    {
      title: '操作',
      dataIndex: 'cz',
      key: 'cz',
      width: 150,
      fixed: 'right',
      render: (text, record, index) => {
        return (
          <Space>
            <Button type="link" onClick={() => allocat(record)}>
              分配
            </Button>
            <Button type="link" onClick={() => checkDetail(record)}>
              详情
            </Button>
          </Space>
        )
      },
    },
  ]

  const pagination = {
    defaultCurrent: 1,
    total: list.totalSize,
    pageSize: pageParams.pageSize,
    showQuickJumper: true,
    showSizeChanger: true,
    current: pageParams.pageNo,
    showTotal: (total) => {
      return `共 ${total} 条记录`
    },
    onChange: onPage,
  }

  return (
    <Table
      rowKey="id"
      dataSource={list.list}
      columns={columns}
      bordered
      pagination={pagination}
      rowSelection={rowSelection}
      scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
