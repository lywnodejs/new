import React, {useEffect, useState} from 'react'
import Router from 'next/router'
import {Table, Button, Popconfirm, message, Badge} from 'antd'
import moment from 'moment'
import api from '~/api/marketing'
const TableList = ({list, onPage, onEdit, pullData, pageParams, onVertify}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)
  const columns = [
    {
      title: '任务ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '任务名',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 100,
      render: (text) => {
        return text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''
      },
    },
    {
      title: '发放人群',
      dataIndex: 'taskObject',
      key: 'taskObject',
      width: 100,
    },
    {
      title: '券ID',
      dataIndex: 'marketingIds',
      key: 'marketingIds',
      width: 100,
    },
    {
      title: '派发时间',
      dataIndex: 'marketingTime',
      key: 'marketingTime',
      width: 100,
      render: (text, record) => {
        return record.marketingSendType == 2
          ? '立即'
          : moment(text).format('YYYY-MM-DD HH:mm:ss')
      },
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
                text == 1
                  ? 'success'
                  : text == 2
                  ? 'processing'
                  : text == 3
                  ? 'default'
                  : 'error'
              }
            />
            {text == 1
              ? '激活'
              : text == 2
              ? '发放中'
              : text == 3
              ? '已完成'
              : '锁定'}
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
            <Button type="link" onClick={() => onCheck(record)}>
              查看
            </Button>

            <Button
              type="link"
              onClick={() => onEdit(record)}
              disabled={record.status != 0}
            >
              编辑
            </Button>

            {(record.status == 0 || record.status == 1) && (
              <Popconfirm
                title={displayByStatus(record)}
                onConfirm={() => onSwitchStatus(record)}
                okText="确定"
                cancelText="取消"
                okButtonProps={{disabled: displayByStatus(record, true)}}
              >
                <Button type="link">
                  {record.status == 1 ? '锁定' : '激活'}
                </Button>
              </Popconfirm>
            )}

            {(record.status == 2 || record.status == 3) && (
              <Button type="link" disabled>
                锁定
              </Button>
            )}
          </>
        )
      },
    },
  ]

  const displayByStatus = (item, isBoolean) => {
    if (item.status == 1) {
      return isBoolean ? false : stopReactElement()
    }
    if (item.status == 0) {
      let expirationTime = new Date(item.marketingTime).getTime()
      let currentExpirationTime = new Date().getTime()
      if (
        expirationTime < currentExpirationTime &&
        item.marketingSendType != 2
      ) {
        return isBoolean ? true : exceedTimeReactElement()
      }
      if (item.marketingUsedNum <= 0 && item.marketingSendType != 2) {
        return isBoolean ? true : exceedNumReactElement()
      }

      return isBoolean ? false : startReactElement()
    }
  }

  const onSwitchStatus = async (item) => {
    try {
      const {data} = await api.edit_marketing_task({
        status: item.status == 1 ? 0 : 1,
        id: item.id,
        marketingIds: item.marketingIds,
      })
      if (data.code == 0) {
        message.success(`${item.status == 1 ? '锁定' : '激活'}成功`)
        pullData()
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo)
    }
  }

  const onCheck = (item) => {
    let url = `/market/coupon/history?taskName=${item.taskName}`
    location.href = url
  }
  const stopReactElement = () => {
    return '暂停该优惠券？'
  }
  const startReactElement = () => {
    return '发放该优惠券？'
  }
  const exceedTimeReactElement = () => {
    return (
      <>
        <p>已经过了派发时间，不能发放。</p>
        <p>如果需要发放，请重新编辑。</p>
      </>
    )
  }
  const exceedNumReactElement = () => {
    return (
      <>
        <p>已经没有可派发的数量，不能发放。</p>
        <p>如果需要发放，请重新编辑。</p>
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
