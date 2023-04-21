import React, {useState} from 'react'
import {Table, Button, Badge} from 'antd'
import moment from 'moment'
import styles from './index.less'

const TableList = ({list, onPage, onEdit, pageParams, onDelete}) => {
  const [pageSize, setPageSize] = useState(pageParams.pageSize)

  const isNewAdd = (time) => {
    let diff = moment().diff(moment(time), 'day', true)
    return diff <= 3
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (t, r, i) => {
        const isNew = isNewAdd(r.updateTime)
        return (
          <React.Fragment>
            <span className={isNew ? styles.newTips : ''}>{t}</span>
          </React.Fragment>
        )
      },
    },
    {
      title: '数据库类型',
      dataIndex: 'databaseType',
      key: 'databaseType',
      width: 100,
    },
    {
      title: '主机',
      dataIndex: 'hostname',
      key: 'hostname',
      width: 100,
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
      width: 100,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName',
      width: 100,
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 100,
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
              更新
            </Button>

            <Button type="link" onClick={() => onDelete(record)}>
              删除
            </Button>
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

  return (
    <Table
      rowKey="id"
      dataSource={list.list}
      columns={columns}
      bordered
      pagination={pagination}
      // scroll={{y: '100%', x: '100%'}}
    />
  )
}

export default TableList
